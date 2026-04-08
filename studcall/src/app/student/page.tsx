import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudentDashboard } from "./student-dashboard"

export default async function StudentPage() {
  const supabase = createClient()
  
  // Contournement pour permettre le rendu visuel si la configuration Supabase n'est pas encore appliquée
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return (
          <div className="p-6 md:p-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Espace Étudiant (Mock)</h1>
            <p className="mb-6 text-muted-foreground">La connexion Supabase n'est pas configurée. Interface simulée.</p>
            <StudentDashboard activeSession={{id: "mock_session", radius: 100, latitude: 48.8566, longitude: 2.3522, groups: {name: "Développement Web IA"}}} studentId="mock_student" alreadyMarked={false} />
          </div>
      )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: groups } = await supabase
    .from('group_students')
    .select('group_id')
    .eq('student_id', user.id)
  
  const groupIds = groups?.map(g => g.group_id) || []

  let activeSession = null
  let alreadyMarked = false

  if (groupIds.length > 0) {
    const { data: sessions } = await supabase
      .from('attendance_sessions')
      .select('*, groups(name)')
      .in('group_id', groupIds)
      .eq('is_active', true)
    
    if (sessions && sessions.length > 0) {
      activeSession = sessions[0]
      const { data: record } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('session_id', activeSession.id)
        .eq('student_id', user.id)
        .single()
      
      alreadyMarked = !!record
    }
  }

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center bg-card/50 backdrop-blur border border-white/5 p-4 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">Espace Étudiant</h1>
        <div className="text-sm px-3 py-1 bg-secondary rounded-full">
            {user.email}
        </div>
      </div>
      <StudentDashboard 
        activeSession={activeSession} 
        studentId={user.id} 
        alreadyMarked={alreadyMarked} 
      />
    </div>
  )
}
