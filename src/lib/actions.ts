"use server"

import { createClient } from "./supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isWithinRange } from "./geo"

export async function createSession(groupId: string, lat: number, lon: number, radius = 100) {
  const supabase = createClient()
  
  // 1. Vérifier si l'utilisateur est un enseignant
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié", type: 'technical' }
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (userData?.role !== 'teacher' && userData?.role !== 'admin') {
    return { error: "Seuls les enseignants peuvent créer une session", type: 'validation' }
  }

  // 2. Vérifier si une session est déjà active pour ce groupe (Edge Case US26)
  const { data: activeSession } = await supabase
    .from('attendance_sessions')
    .select('id')
    .eq('group_id', groupId)
    .eq('is_active', true)
    .single()

  if (activeSession) {
    return { error: "Une session est déjà active pour ce groupe. Clôturez-la avant d'en ouvrir une nouvelle.", type: 'validation' }
  }

  // 3. Créer la session
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert([{ group_id: groupId, latitude: lat, longitude: lon, radius, is_active: true }])
    .select()

  revalidatePath('/teacher')
  return { data, error }
}

export async function closeSession(sessionId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('attendance_sessions')
    .update({ is_active: false, closed_at: new Date().toISOString() })
    .eq('id', sessionId)

  revalidatePath('/teacher')
  return { error }
}

export async function submitAttendance(sessionId: string, studentId: string, lat?: number, lon?: number) {
  const supabase = createClient()
  
  // 1. Récupérer la session
  const { data: session, error: sessionError } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
    
  if (sessionError || !session) return { error: "Session introuvable ou déjà supprimée.", type: 'technical' }
  if (!session.is_active) return { error: "L'appel est terminé. Vous ne pouvez plus émarger.", type: 'validation' }

  // 2. Vérifier la géolocalisation si fournie (Sécurité Serveur)
  if (lat !== undefined && lon !== undefined) {
    const inRange = isWithinRange(lat, lon, session.latitude, session.longitude, session.radius, 10)
    if (!inRange) {
      return { error: "Vous êtes trop loin de la zone d'émargement.", type: 'validation' }
    }
  }

  // 3. Enregistrer la présence
  const { error } = await supabase
    .from('attendance_records')
    .insert([{ session_id: sessionId, student_id: studentId, status: 'present' }])

  // Gestion spécifique de l'erreur de doublon (Edge Case US26)
  if (error) {
    if (error.code === '23505') {
       return { error: "Vous avez déjà émargé pour cette session.", type: 'validation' }
    }
    return { error: "Erreur technique lors de l'enregistrement.", type: 'technical' }
  }

  revalidatePath('/student')
  return { error: null }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/login')
}

