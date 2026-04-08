"use server"

import { createClient } from "./supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createSession(groupId: string, lat: number, lon: number, radius = 100) {
  const supabase = createClient()
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

export async function submitAttendance(sessionId: string, studentId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('attendance_records')
    .insert([{ session_id: sessionId, student_id: studentId, status: 'present' }])

  revalidatePath('/student')
  return { error }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/login')
}

