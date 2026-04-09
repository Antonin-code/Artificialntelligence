"use server"

import { createClient } from "./supabase/server"
import { revalidatePath } from "next/cache"

export async function approveUserAccount(userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update({ status: 'approved' })
    .eq('id', userId)

  revalidatePath('/admin')
  return { error }
}

export async function rejectUserAccount(userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update({ status: 'rejected' })
    .eq('id', userId)

  revalidatePath('/admin')
  return { error }
}

export async function updateUserAccount(userId: string, name: string, role: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update({ name, role })
    .eq('id', userId)

  revalidatePath('/admin')
  return { error }
}

export async function banUserAccount(userId: string) {
  const supabase = createClient()
  
  // Remove user from any assigned groups so they don't appear in counts or classes
  await supabase.from('group_students').delete().eq('student_id', userId)

  const { error } = await supabase
    .from('users')
    .update({ status: 'rejected' }) // equivalent to soft delete
    .eq('id', userId)

  revalidatePath('/admin')
  return { error }
}

export async function createGroup(name: string, members: string[]) {
  const supabase = createClient()
  
  // Get current user to set as teacher_id
  const { data: { user } } = await supabase.auth.getUser()
  const teacherId = user?.id || null

  // Create group
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert([{ name, teacher_id: teacherId }])
    .select()
    .single()
    
  if (groupError || !group) return { error: groupError }

  // Assign members
  if (members && members.length > 0) {
      const inserts = members.map(studentId => ({
          group_id: group.id,
          student_id: studentId
      }))
      
      const { error: membersError } = await supabase
        .from('group_students')
        .insert(inserts)
        
      if (membersError) return { error: membersError }
  }

  revalidatePath('/admin')
  revalidatePath('/teacher')
  return { error: null }
}

export async function updateGroup(groupId: string, name: string, members: string[]) {
  const supabase = createClient()
  
  // Update name
  const { error: groupError } = await supabase
    .from('groups')
    .update({ name })
    .eq('id', groupId)
    
  if (groupError) return { error: groupError }

  // Clear existing members
  await supabase.from('group_students').delete().eq('group_id', groupId)

  // Re-assign members
  if (members && members.length > 0) {
      const inserts = members.map(studentId => ({
          group_id: groupId,
          student_id: studentId
      }))
      
      const { error: membersError } = await supabase
        .from('group_students')
        .insert(inserts)
        
      if (membersError) return { error: membersError }
  }

  revalidatePath('/admin')
  revalidatePath('/teacher')
  return { error: null }
}

export async function deleteGroup(groupId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId)

  revalidatePath('/admin')
  revalidatePath('/teacher')
  return { error }
}
