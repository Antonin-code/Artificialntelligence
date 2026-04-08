import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { AdminDashboard } from "./admin-dashboard"

export default async function AdminPage() {
  const supabase = createClient()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return (
          <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
              <div className="p-3 bg-red-500/20 text-red-500 rounded-xl shadow-inner"><ShieldCheck size={32} /></div>
              <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Administration (Mode Démo)</h1>
                  <p className="text-muted-foreground">La base de données n'est pas connectée. Données factices.</p>
              </div>
            </div>
            
            <AdminDashboard 
                users={[{id: '1', name: 'Alice', email: 'alice@test.fr', role: 'student'}, {id: '2', name: 'Bob', email: 'bob@test.fr', role: 'teacher'}]} 
                pendingUsers={[{id: '3', name: 'Charlie (Mock)', email: 'charlie@test.com', role: 'student'}]} 
                groups={[]} 
            />
          </div>
      )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all approved users
  const { data: users } = await supabase.from('users').select('*').eq('status', 'approved').order('created_at', { ascending: false })
  // Fetch pending users
  const { data: pendingUsers } = await supabase.from('users').select('*').eq('status', 'pending').order('created_at', { ascending: false })
  // Fetch groups with students to allow editing
  const { data: groups } = await supabase.from('groups').select('*, group_students(student_id)').order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="p-3 bg-red-500/20 text-red-500 rounded-xl shadow-inner">
            <ShieldCheck size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Panneau d'Administration</h1>
            <p className="text-muted-foreground">Gérez l'ensemble des accès et de la structure de l'établissement.</p>
        </div>
      </div>
      
      <AdminDashboard users={users || []} pendingUsers={pendingUsers || []} groups={groups || []} />
    </div>
  )
}
