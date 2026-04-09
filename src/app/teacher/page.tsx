import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TeacherDashboard } from "./teacher-dashboard"

export default async function TeacherPage() {
  const supabase = createClient()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock for UI demonstration
      return (
        <div className="min-h-screen bg-background">
          <div className="border-b border-border bg-card/40 backdrop-blur-md">
            <div className="max-w-6xl mx-auto p-4 px-6 flex justify-between items-center">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Dashbord Enseignant (Mock)</h1>
            </div>
          </div>
          <div className="p-6 md:p-12 max-w-6xl mx-auto">
            <TeacherDashboard 
                groups={[{id: "1", name: "Dev Web IA"}, {id:"2", name: "Sécurité"}]} 
                activeSession={null}
                attendanceStats={[]}
                allStudents={[{id: "3", name: "Élève Démo", email: "demo@test.com", role: "student"}]}
            />
          </div>
        </div>
      )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: assignedGroups } = await supabase
    .from('group_students')
    .select('groups(*)')
    .eq('student_id', user.id)

  const mappedGroups = assignedGroups?.map((ag: any) => Array.isArray(ag.groups) ? ag.groups[0] : ag.groups).filter(Boolean) || []

  const { data: ownedGroups } = await supabase
    .from('groups')
    .select('*')
    .eq('teacher_id', user.id)

  const allGroupsRaw = [...mappedGroups, ...(ownedGroups || [])]
  let groups = Array.from(new Map(allGroupsRaw.map(g => [g.id, g])).values())

  if (groups.length > 0) {
      const { data: groupMembers } = await supabase
        .from('group_students')
        .select('group_id, users(id, name, email, role)')
        .in('group_id', groups.map(g => g.id))

      groups = groups.map(g => {
          const allMembers = groupMembers
            ?.filter(gm => gm.group_id === g.id)
            ?.map(gm => Array.isArray(gm.users) ? gm.users[0] : gm.users) || []
          // Ne conserver que les étudiants pour l&apos;affichage de la liste et le comptage
          const students = allMembers.filter((u: any) => u?.role === 'student')
          return { ...g, students }
      })
  }
  
  let activeSession = null
  let attendanceStats: any[] = []
  let pastSessions: any[] = []

  if (groups && groups.length > 0) {
    const { data: sessions } = await supabase
      .from('attendance_sessions')
      .select('*, groups(name)')
      .in('group_id', groups.map(g => g.id))
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)

    if (sessions && sessions.length > 0) {
      activeSession = sessions[0]

      const { data: studentsInfo } = await supabase
        .from('group_students')
        .select('users(id, name, email, role)')
        .eq('group_id', activeSession.group_id)

      const { data: recordsInfo } = await supabase
        .from('attendance_records')
        .select('student_id, timestamp')
        .eq('session_id', activeSession.id)

      const presentStudentIds = new Set(recordsInfo?.map(r => r.student_id))

      const mappedStats = studentsInfo?.map(entry => Array.isArray(entry.users) ? entry.users[0] : entry.users) || []
      attendanceStats = mappedStats.filter((u: any) => u?.role === 'student').map((student: any) => ({
          id: student?.id,
          name: student?.name,
          email: student?.email,
          isPresent: presentStudentIds.has(student?.id)
      }))
    }

    // Fetch past sessions history
    const { data: closedSessions } = await supabase
      .from('attendance_sessions')
      .select('*, groups(name), attendance_records(student_id)')
      .in('group_id', groups.map(g => g.id))
      .eq('is_active', false)
      .order('created_at', { ascending: false })
      .limit(50) // Limiting to 50 for performance
      
    pastSessions = closedSessions || []
  }

  const { data: allStudents } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'student')
    .eq('status', 'approved')
    .order('name');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/5 bg-card/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto p-5 px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                   SC
               </div>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Panel Enseignant</h1>
            </div>
            <div className="text-sm px-4 py-1.5 bg-secondary/80 border border-white/10 rounded-full font-medium">
                {user.email}
            </div>
        </div>
      </div>
      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <TeacherDashboard 
            groups={groups || []} 
            activeSession={activeSession}
            attendanceStats={attendanceStats}
            allStudents={allStudents || []}
            pastSessions={pastSessions}
        />
      </div>
    </div>
  )
}
