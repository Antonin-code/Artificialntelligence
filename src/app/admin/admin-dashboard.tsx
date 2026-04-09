"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Users, GraduationCap, CheckCircle, XCircle, Loader2, Edit2, Trash2, X } from "lucide-react"
import { approveUserAccount, rejectUserAccount, createGroup, updateGroup, deleteGroup, updateUserAccount, banUserAccount } from "@/lib/admin-actions"

export function AdminDashboard({ users, groups, pendingUsers }: any) {
  const [activeTab, setActiveTab] = useState("pending")
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Group management state
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [isDeletingGroup, setIsDeletingGroup] = useState<string | null>(null)

  // User management state
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editUserName, setEditUserName] = useState("")
  const [editUserRole, setEditUserRole] = useState("")
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
      setLoadingId(id)
      await approveUserAccount(id)
      setLoadingId(null)
  }

  const handleReject = async (id: string) => {
      setLoadingId(id)
      await rejectUserAccount(id)
      setLoadingId(null)
  }

  const handleEditUser = (u: any) => {
      setEditingUserId(u.id)
      setEditUserName(u.name)
      setEditUserRole(u.role)
  }

  const handleCancelEditUser = () => {
      setEditingUserId(null)
  }

  const handleSaveUser = async (id: string) => {
      setLoadingId(id)
      await updateUserAccount(id, editUserName, editUserRole)
      setLoadingId(null)
      setEditingUserId(null)
  }

  const handleDeleteUser = async (id: string) => {
      if(!confirm("Voulez-vous suspendre l&apos;accès de cet utilisateur ? Son compte repassera en 'refusé' et il devra vous contacter pour le réactiver.")) return;
      setIsDeletingUser(id)
      await banUserAccount(id)
      setIsDeletingUser(null)
  }

  const handleEditGroup = (group: any) => {
      setEditingGroupId(group.id)
      setNewGroupName(group.name)
      setSelectedMembers(group.group_students?.map((gs: any) => gs.student_id) || [])
  }

  const handleCancelEdit = () => {
      setEditingGroupId(null)
      setNewGroupName("")
      setSelectedMembers([])
  }

  const handleDeleteGroup = async (id: string) => {
      if(!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible et supprimera tout l&apos;historique d&apos;appel de ce groupe.")) return;
      setIsDeletingGroup(id)
      await deleteGroup(id)
      setIsDeletingGroup(null)
      if (editingGroupId === id) handleCancelEdit()
  }

  const handleSaveGroup = async () => {
      if (!newGroupName.trim()) return
      setIsCreatingGroup(true)
      
      if (editingGroupId) {
          await updateGroup(editingGroupId, newGroupName, selectedMembers)
      } else {
          await createGroup(newGroupName, selectedMembers)
      }
      
      handleCancelEdit()
      setIsCreatingGroup(false)
  }

  const toggleMember = (id: string) => {
      setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-2 rounded-xl backdrop-blur-md border border-white/5 w-fit">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <div className="flex items-center gap-2">
                  <ShieldCheck size={16} /> En Attente 
                  {pendingUsers.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingUsers.length}</span>}
              </div>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <div className="flex items-center gap-2"><Users size={16} /> Utilisateurs Approuvés</div>
          </button>
          <button 
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'groups' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
              <div className="flex items-center gap-2"><GraduationCap size={16} /> Groupes & Classes</div>
          </button>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'pending' && (
          <Card className="glass-panel border-white/10">
              <CardHeader>
                  <CardTitle>Inscriptions en attente de validation</CardTitle>
                  <CardDescription>Veuillez approuver ou refuser les nouveaux comptes.</CardDescription>
              </CardHeader>
              <CardContent>
                  {pendingUsers.length === 0 ? (
                       <div className="p-8 text-center text-muted-foreground bg-black/20 rounded-xl border border-dashed border-white/5">
                          Aucune demande d&apos;inscription en attente.
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {pendingUsers.map((u: any) => (
                              <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-white/5 hover:bg-white/5 transition-colors">
                                  <div>
                                      <p className="font-bold flex items-center gap-2">
                                          {u.name}
                                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 uppercase tracking-wider">{u.role}</span>
                                      </p>
                                      <p className="text-sm text-muted-foreground mt-1">{u.email}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleReject(u.id)} disabled={loadingId !== null}>
                                          {loadingId === u.id ? <Loader2 className="animate-spin w-4 h-4" /> : <XCircle className="w-4 h-4 mr-2" />} Refuser
                                      </Button>
                                      <Button className="bg-green-600 hover:bg-green-500 text-white" onClick={() => handleApprove(u.id)} disabled={loadingId !== null}>
                                          {loadingId === u.id ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4 mr-2" />} Approuver
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </CardContent>
          </Card>
      )}

      {activeTab === 'users' && (
          <Card className="glass-panel border-white/10">
              <CardHeader>
                  <CardTitle>Utilisateurs Approuvés</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                      {users.map((u: any) => (
                          <div key={u.id} className={`p-3 rounded-lg border transition-all ${editingUserId === u.id ? 'bg-black/40 border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'bg-black/20 border-white/5'}`}>
                              {editingUserId === u.id ? (
                                  <div className="flex flex-col gap-3 py-2">
                                      <div className="grid grid-cols-2 gap-3">
                                          <div>
                                              <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Nom complet</label>
                                              <input type="text" value={editUserName} onChange={(e) => setEditUserName(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-background/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" />
                                          </div>
                                          <div>
                                              <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Rôle assigné</label>
                                              <select value={editUserRole} onChange={(e) => setEditUserRole(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-background/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-inner">
                                                  <option value="student" className="bg-background">Étudiant</option>
                                                  <option value="teacher" className="bg-background">Enseignant</option>
                                                  <option value="admin" className="bg-background">Administrateur</option>
                                              </select>
                                          </div>
                                      </div>
                                      <div className="flex justify-end gap-2 mt-2">
                                          <Button variant="ghost" size="sm" onClick={handleCancelEditUser} className="h-8 hover:bg-white/5">Annuler</Button>
                                          <Button size="sm" onClick={() => handleSaveUser(u.id)} disabled={loadingId === u.id} className="h-8">
                                              {loadingId === u.id ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null} Sauvegarder
                                          </Button>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-between">
                                      <div>
                                          <p className="font-semibold text-sm">{u.name}</p>
                                          <p className="text-xs text-muted-foreground">{u.email}</p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${u.role === 'teacher' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/20'}`}>{u.role}</span>
                                          <div className="flex gap-1 border-l border-white/10 pl-3">
                                              <Button variant="ghost" size="icon" onClick={() => handleEditUser(u)} className="h-7 w-7 hover:bg-blue-500/20 hover:text-blue-400 text-muted-foreground">
                                                  <Edit2 size={14} />
                                              </Button>
                                              <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(u.id)} disabled={isDeletingUser === u.id} className="h-7 w-7 hover:bg-red-500/20 text-muted-foreground hover:text-red-400">
                                                  {isDeletingUser === u.id ? <Loader2 className="animate-spin" size={14}/> : <Trash2 size={14} />}
                                              </Button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      )}

      {activeTab === 'groups' && (
          <div className="grid md:grid-cols-2 gap-8">
              <Card className={`glass-panel border-white/10 h-fit ${editingGroupId ? 'ring-2 ring-primary border-primary/50' : ''}`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{editingGroupId ? "Modifier le groupe" : "Créer une classe / groupe"}</CardTitle>
                      {editingGroupId && (
                          <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="text-muted-foreground hover:text-white rounded-full h-8 w-8">
                              <X size={16} />
                          </Button>
                      )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Nom du groupe</label>
                          <input 
                              type="text" 
                              value={newGroupName} 
                              onChange={(e) => setNewGroupName(e.target.value)} 
                              placeholder="Ex: BUT 3 Informatique"
                              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-primary"
                          />
                      </div>
                      <div className="pt-2">
                           <label className="text-xs font-semibold uppercase text-muted-foreground mb-3 block">Sélectionner les étudiants / professeurs associés</label>
                           <div className="max-h-60 overflow-y-auto space-y-1 mb-4 p-2 bg-black/20 rounded-lg border border-white/5">
                               {users.filter((u:any) => u.role !== 'admin').map((u: any) => (
                                   <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors">
                                       <input type="checkbox" checked={selectedMembers.includes(u.id)} onChange={() => toggleMember(u.id)} className="rounded border-white/20 bg-black/50 text-primary focus:ring-primary h-4 w-4" />
                                       <div className="flex-1">
                                           <p className="text-sm font-medium leading-none">{u.name}</p>
                                           <p className="text-xs text-muted-foreground mt-1">{u.email}</p>
                                       </div>
                                       <span className="text-[10px] text-muted-foreground uppercase">{u.role}</span>
                                   </label>
                               ))}
                           </div>
                           <Button className="w-full" onClick={handleSaveGroup} disabled={isCreatingGroup || !newGroupName.trim()}>
                               {isCreatingGroup ? <Loader2 className="animate-spin mr-2" size={16}/> : null} 
                               {editingGroupId ? "Enregistrer les modifications" : "Créer le groupe"}
                           </Button>
                           {editingGroupId && (
                               <Button variant="outline" className="w-full mt-2 border-white/20 hover:bg-white/5" onClick={handleCancelEdit}>
                                   Annuler l&apos;édition
                               </Button>
                           )}
                      </div>
                  </CardContent>
              </Card>

              <Card className="glass-panel border-white/10">
                  <CardHeader>
                      <CardTitle>Groupes existants</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {groups.map((g: any) => (
                              <div key={g.id} className={`p-4 rounded-xl bg-card border flex justify-between items-start transition-all ${editingGroupId === g.id ? 'border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-white/5'}`}>
                                  <div>
                                      <h4 className="font-bold text-lg text-primary">{g.name}</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{g.group_students?.length || 0} membres affectés</p>
                                  </div>
                                  <div className="flex gap-1">
                                      <Button variant="ghost" size="icon" onClick={() => handleEditGroup(g)} className={`h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400 ${editingGroupId === g.id ? 'text-blue-400 bg-blue-500/10' : 'text-muted-foreground'}`}>
                                          <Edit2 size={16} />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(g.id)} disabled={isDeletingGroup === g.id} className="h-8 w-8 hover:bg-red-500/20 text-muted-foreground hover:text-red-400">
                                          {isDeletingGroup === g.id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16} />}
                                      </Button>
                                  </div>
                              </div>
                          ))}
                          {groups.length === 0 && (
                              <p className="text-sm text-muted-foreground">Aucun groupe généré pour le moment.</p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  )
}
