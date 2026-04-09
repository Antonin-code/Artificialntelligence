"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, StopCircle, PlayCircle, Loader2, Check, X, ShieldAlert, PlusCircle, LayoutDashboard, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { createSession, closeSession } from "@/lib/actions"
import { createGroup } from "@/lib/admin-actions"

export function TeacherDashboard({ groups, activeSession, attendanceStats, allStudents, pastSessions }: any) {
  const [activeTab, setActiveTab] = useState("session")
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mockActive, setMockActive] = useState(false)
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  // Group creation state
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const handleStartSession = async () => {
    if (!selectedGroup) return
    setLoading(true)
    setError(null)

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
             if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                 setTimeout(() => {
                     setMockActive(true)
                     setLoading(false)
                 }, 800)
                 return;
             }
             const res = await createSession(selectedGroup, pos.coords.latitude, pos.coords.longitude, 100)
             if (res.error) setError(res.error.message)
             setLoading(false)
          },
          (err) => {
            setError("Veuillez autoriser la géolocalisation de votre navigateur pour fixer le point d&apos;appel de la classe.")
            setLoading(false)
          }
        )
    } else {
        setError("Géolocalisation non supportée.")
        setLoading(false)
    }
  }

  const handleStopSession = async () => {
    setLoading(true)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setMockActive(false)
        setLoading(false)
        return
    }
    await closeSession(activeSession.id)
    setLoading(false)
  }

  const handleCreateGroup = async () => {
      if (!newGroupName.trim()) return
      setIsCreatingGroup(true)
      await createGroup(newGroupName, selectedMembers)
      setNewGroupName("")
      setSelectedMembers([])
      setIsCreatingGroup(false)
      setActiveTab("session") // Switch back to see the new group
  }

  const toggleMember = (id: string) => {
      setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4 bg-black/20 p-1.5 rounded-xl w-fit border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('session')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'session' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <LayoutDashboard size={16} /> Session d&apos;appel
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'manage' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <PlusCircle size={16} /> Créer un Groupe
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <Users size={16} /> Mes Classes
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <Clock size={16} /> Historique
          </button>
      </div>

      {activeTab === 'session' && (
        <>
        { (activeSession || mockActive) ? (
             <div className="grid gap-8 md:grid-cols-3">
                 <Card className="md:col-span-1 border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] bg-card/60 backdrop-blur-2xl">
                     <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent rounded-t-xl border-b border-white/5 pb-5">
                         <CardTitle className="text-lg flex items-center justify-between font-bold">
                             Session Active
                             <span className="flex h-3.5 w-3.5 relative shadow-[0_0_10px_rgba(34,197,94,0.8)] rounded-full">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
                             </span>
                         </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-6">
                         <div>
                             <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Groupe / Classe</p>
                             <p className="font-bold text-xl text-primary/90">{activeSession?.groups?.name || 'Groupe Test (Mock)'}</p>
                         </div>
                         <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                             <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Taux d&apos;Émargement</p>
                             <div className="flex items-baseline gap-2">
                                 <p className="font-extrabold text-5xl text-white">{attendanceStats.length > 0 ? attendanceStats.filter((s:any) => s.isPresent).length : 0}</p>
                                 <p className="text-xl font-medium text-muted-foreground">/ {attendanceStats.length}</p>
                             </div>
                             <div className="w-full bg-primary/10 rounded-full h-1.5 mt-4 overflow-hidden">
                                 <div className="bg-primary h-1.5 rounded-full" style={{width: `${attendanceStats.length === 0 ? 0 : (attendanceStats.filter((s:any) => s.isPresent).length/attendanceStats.length)*100}%`}}></div>
                             </div>
                         </div>
                     </CardContent>
                     <CardFooter className="pb-6 px-6">
                         <Button variant="destructive" className="w-full h-12 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all" onClick={handleStopSession} disabled={loading}>
                             {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <StopCircle className="mr-2" size={18} />}
                             Clôturer l&apos;appel
                         </Button>
                     </CardFooter>
                 </Card>

                 <Card className="md:col-span-2 glass-panel border-white/5 bg-background/40">
                     <CardHeader className="border-b border-white/5 pb-5">
                         <CardTitle className="flex items-center gap-3 text-xl">
                             <div className="p-2 bg-primary/20 text-primary rounded-lg font-bold">
                                 <Users size={20} />
                             </div>
                             Liste des étudiants
                         </CardTitle>
                         <CardDescription>Mise à jour en temps réel des présences</CardDescription>
                     </CardHeader>
                     <CardContent className="pt-6">
                         {attendanceStats.length === 0 ? (
                             <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-black/20 rounded-xl border border-dashed border-white/10">
                                 <ShieldAlert className="mb-4 text-primary/40" size={48} />
                                 <p className="font-medium text-lg">Aucun étudiant dans cette classe.</p>
                             </div>
                         ) : (
                             <div className="grid gap-3">
                                 {attendanceStats.map((s:any, idx: number) => (
                                     <div key={s.id || idx} className="flex items-center justify-between p-4 rounded-xl bg-card border border-white/5 hover:bg-card/80 transition-colors">
                                         <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                                                 {s.name?.charAt(0) || '?'}
                                             </div>
                                             <div>
                                                 <p className="font-bold">{s.name}</p>
                                                 <p className="text-xs text-muted-foreground mt-0.5">{s.email}</p>
                                             </div>
                                         </div>
                                         <div>
                                             {s.isPresent ? (
                                                 <div className="flex items-center gap-1.5 text-sm font-bold text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                                                    <Check size={16} /> Présent
                                                 </div>
                                             ) : (
                                                 <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground bg-muted/30 px-4 py-1.5 rounded-full border border-white/5">
                                                    <X size={16} /> Absent
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         )}
                     </CardContent>
                 </Card>
             </div>
        ) : (
          <Card className="max-w-lg mx-auto glass-panel shadow-2xl border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              <CardHeader className="pb-8 pt-10 px-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-blue-500/30 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
                      <MapPin size={32} />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mb-2">Lancer l&apos;appel</CardTitle>
                  <CardDescription className="text-base text-muted-foreground/80">
                      Ouvrez une session géolocalisée. Seuls les étudiants pourront valider leur présence.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-8">
                  {error && <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 shadow-inner">{error}</div>}
                  
                  {groups.length === 0 ? (
                      <div className="p-4 bg-black/30 rounded-xl text-muted-foreground text-center text-sm border border-dashed border-white/20">Vous n&apos;avez aucun groupe. Utilisez l&apos;onglet &quot;Créer un Groupe&quot;.</div>
                  ) : (
                      <div className="space-y-3">
                          <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sélectionnez la classe</label>
                          <div className="relative">
                              <select 
                                  className="flex h-14 w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-base font-medium ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                                  value={selectedGroup}
                                  onChange={(e) => setSelectedGroup(e.target.value)}
                              >
                                  {groups.map((g:any) => (
                                      <option key={g.id} value={g.id} className="bg-background text-foreground py-2">{g.name}</option>
                                  ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">▼</div>
                          </div>
                      </div>
                  )}
              </CardContent>
              <CardFooter className="px-8 pb-10">
                  <Button size="lg" className="w-full text-lg h-14 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all" onClick={handleStartSession} disabled={!selectedGroup || loading}>
                      {loading ? <Loader2 className="animate-spin mr-3" /> : <PlayCircle className="mr-3" size={24} />}
                      Générer la balise de présence
                  </Button>
              </CardFooter>
          </Card>
        )}
        </>
      )}

      {activeTab === 'manage' && (
          <Card className="max-w-2xl mx-auto glass-panel border-white/10 overflow-hidden">
               <CardHeader className="bg-primary/5 border-b border-white/5">
                  <CardTitle className="flex items-center gap-2">
                       <PlusCircle className="text-primary" /> Créer un nouveau groupe d&apos;étudiants
                  </CardTitle>
                  <CardDescription>Définissez le nom de la classe et sélectionnez les étudiants membres.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground block ml-1">Nom du groupe / classe</label>
                      <input 
                          type="text" 
                          value={newGroupName} 
                          onChange={(e) => setNewGroupName(e.target.value)} 
                          placeholder="Ex: BUT 3 Informatique TD2"
                          className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-base font-medium ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition-all shadow-inner"
                      />
                  </div>
                  
                  <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground block ml-1">Sélectionner les étudiants ({selectedMembers.length} sélectionnés)</label>
                      <div className="max-h-72 overflow-y-auto space-y-1 p-2 bg-black/20 rounded-xl border border-white/5 scrollbar-thin scrollbar-thumb-primary/20">
                          {allStudents.length === 0 ? (
                              <p className="p-4 text-center text-sm text-muted-foreground italic">Aucun étudiant approuvé trouvé en base.</p>
                          ) : (
                              allStudents.map((u: any) => (
                                  <label key={u.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedMembers.includes(u.id) ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent border-transparent hover:bg-white/5 text-foreground'}`}>
                                      <input 
                                          type="checkbox" 
                                          checked={selectedMembers.includes(u.id)} 
                                          onChange={() => toggleMember(u.id)} 
                                          className="rounded border-white/20 bg-black/50 text-primary focus:ring-primary h-5 w-5" 
                                      />
                                      <div className="flex-1">
                                          <p className="text-sm font-bold">{u.name}</p>
                                          <p className="text-xs opacity-70">{u.email}</p>
                                      </div>
                                  </label>
                              ))
                          )}
                      </div>
                  </div>
              </CardContent>
              <CardFooter className="pb-8 px-6">
                   <Button size="lg" className="w-full h-14 rounded-xl text-lg shadow-lg" onClick={handleCreateGroup} disabled={isCreatingGroup || !newGroupName.trim() || selectedMembers.length === 0}>
                       {isCreatingGroup ? <Loader2 className="animate-spin mr-2" size={20}/> : <Check className="mr-2" size={20} />}
                       Finaliser la création du groupe
                   </Button>
              </CardFooter>
          </Card>
      )}

      {activeTab === 'list' && (
          <div className="space-y-6">
              {groups.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground bg-black/20 rounded-xl border border-dashed border-white/5">
                      Vous n&apos;avez aucune classe d&apos;assignée pour le moment.
                  </div>
              ) : (
                  groups.map((g: any) => (
                      <Card key={g.id} className="glass-panel border-white/10">
                           <CardHeader className="bg-primary/5 border-b border-white/5 pb-4">
                               <CardTitle className="text-xl text-primary font-bold">{g.name}</CardTitle>
                               <CardDescription>{g.students?.length || 0} étudiants inscrits</CardDescription>
                           </CardHeader>
                           <CardContent className="pt-4">
                               <div className="grid md:grid-cols-2 gap-3">
                                   {g.students && g.students.length > 0 ? (
                                       g.students.map((s: any) => (
                                           <div key={s.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5 hover:bg-black/50 transition-colors">
                                               <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-foreground">
                                                   {s.name?.charAt(0) || '?'}
                                               </div>
                                               <div>
                                                   <p className="text-sm font-bold">{s.name}</p>
                                                   <p className="text-xs text-muted-foreground">{s.email}</p>
                                               </div>
                                           </div>
                                       ))
                                   ) : (
                                       <p className="text-sm text-muted-foreground italic col-span-2 p-2">Aucun étudiant n&apos;a été assigné à cette classe.</p>
                                   )}
                               </div>
                           </CardContent>
                      </Card>
                  ))
              )}
          </div>
      )}

      {activeTab === 'history' && (
          <Card className="glass-panel border-white/10">
              <CardHeader className="bg-primary/5 border-b border-white/5">
                  <CardTitle className="flex items-center gap-2">
                       <Clock className="text-primary" /> Historique des appels
                  </CardTitle>
                  <CardDescription>Consultez les émargements de vos précédentes sessions.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                  {!pastSessions || pastSessions.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground bg-black/20 rounded-xl border border-dashed border-white/5">
                          Aucun historique d&apos;appel disponible.
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {pastSessions.map((session: any) => {
                              const group = groups.find((g:any) => g.id === session.group_id);
                              const groupSize = group?.students?.length || 0;
                              const presents = session.attendance_records?.length || 0;
                              const percent = groupSize > 0 ? Math.round((presents / groupSize) * 100) : 0;
                              const presentSet = new Set(session.attendance_records?.map((r: any) => r.student_id));
                              const isExpanded = expandedSessionId === session.id;
                              
                              return (
                                  <div key={session.id} className="flex flex-col border border-white/5 bg-card/50 rounded-xl overflow-hidden hover:bg-white/5 transition-colors">
                                      {/* Header de la session */}
                                      <div 
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer"
                                        onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                                      >
                                          <div>
                                              <h4 className="font-bold text-lg text-primary">{session.groups?.name || 'Groupe Supprimé'}</h4>
                                              <p className="text-sm text-muted-foreground capitalize">
                                                {new Date(session.created_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                              </p>
                                              {session.closed_at && (
                                                  <p className="text-xs text-muted-foreground mt-1">
                                                      Clôturée le {new Date(session.closed_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute:'2-digit' })}
                                                  </p>
                                              )}
                                          </div>
                                          <div className="flex items-center gap-6 mt-4 md:mt-0 bg-black/30 px-6 py-3 rounded-lg border border-white/5">
                                              <div className="text-center">
                                                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Présents</p>
                                                  <p className="font-bold text-xl text-green-400">{presents} <span className="text-sm text-muted-foreground font-medium">/ {groupSize}</span></p>
                                              </div>
                                              <div className="w-px h-10 bg-white/10 mx-auto hidden sm:block"></div>
                                              <div className="text-center">
                                                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Taux</p>
                                                  <div className="flex items-center gap-2">
                                                     <p className="font-bold text-xl text-white">{percent}%</p>
                                                     <div className="w-16 h-1.5 bg-white/10 rounded-full hidden sm:block">
                                                         <div className="h-full bg-primary rounded-full transition-all" style={{width: `${percent}%`}}></div>
                                                     </div>
                                                  </div>
                                              </div>
                                              <div className="text-muted-foreground border-l border-white/10 pl-3">
                                                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                              </div>
                                          </div>
                                      </div>

                                      {/* Détail de la liste si étendu */}
                                      {isExpanded && (
                                          <div className="p-4 bg-black/30 border-t border-white/10">
                                              <h5 className="font-semibold text-sm mb-3">Détail des présences pour cette session :</h5>
                                              <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                                 {group?.students && group.students.length > 0 ? (
                                                     group.students.map((student: any) => {
                                                         const isPresent = presentSet.has(student.id);
                                                         return (
                                                             <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5">
                                                                 <div className="flex items-center gap-2">
                                                                     <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center font-bold text-[10px]">
                                                                         {student.name?.charAt(0) || '?'}
                                                                     </div>
                                                                     <div>
                                                                         <p className="text-xs font-bold">{student.name}</p>
                                                                         <p className="text-[10px] text-muted-foreground">{student.email}</p>
                                                                     </div>
                                                                 </div>
                                                                 <div>
                                                                     {isPresent ? (
                                                                         <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">Présent</span>
                                                                     ) : (
                                                                         <span className="text-[10px] font-semibold text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Absent</span>
                                                                     )}
                                                                 </div>
                                                             </div>
                                                         )
                                                     })
                                                 ) : (
                                                     <p className="text-xs text-muted-foreground italic col-span-2">Aucun étudiant assigné au groupe lors de cette session.</p>
                                                 )}
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              )
                          })}
                      </div>
                  )}
              </CardContent>
          </Card>
      )}
    </div>
  )
}
