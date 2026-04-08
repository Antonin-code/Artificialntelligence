"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Bypass check if URL is missing for UI demonstration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
       setError("Config Supabase manquante.");
       setLoading(false);
       return;
    }

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
      return
    }

    if (authData.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single()
      
      const role = userData?.role || authData.user.user_metadata?.role || 'student'
      router.push(`/${role}`)
      router.refresh()
    }
  }

  return (
    <Card className="w-full relative overflow-hidden glass-panel border-white/5">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
      <CardHeader className="space-y-3 text-center pb-8 pt-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <MapPin className="text-primary w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold">Connexion StudCall</CardTitle>
        <CardDescription>
          Renseignez vos identifiants pour accéder à la plateforme.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-5">
          {error && <div className="p-3 bg-destructive/20 text-destructive-foreground text-sm rounded-md border border-destructive/50 text-center">{error}</div>}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-muted-foreground ml-1">Adresse Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="enseignant@ecole.fr" 
              className="h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-muted-foreground">Mot de passe</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-8 flex-col gap-4">
          <Button type="submit" size="lg" className="w-full h-12 text-md" disabled={loading}>
            {loading ? "Vérification en cours..." : "Se connecter"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
             Pas encore de compte ? <a href="/register" className="text-primary font-semibold hover:underline">S'inscrire gratuitement</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
