"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
       setError("Config Supabase manquante.");
       setLoading(false);
       return;
    }

    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // After signup, redirect to pending page
    router.push("/pending")
    // Note: Supabase auth might auto-signin after signup if email confirmations are off,
    // but the middleware will catch them and redirect to /pending.
  }

  return (
    <Card className="w-full relative overflow-hidden glass-panel border-white/5">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
      <CardHeader className="space-y-3 text-center pb-6 pt-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <MapPin className="text-primary w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold">Inscription StudCall</CardTitle>
        <CardDescription>
          Créez votre compte. L&apos;administrateur validera votre accès.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-5">
          {error && <div className="p-3 bg-destructive/20 text-destructive-foreground text-sm rounded-md border border-destructive/50 text-center">{error}</div>}
          
          <div className="space-y-3">
            <Label htmlFor="name" className="text-muted-foreground ml-1">Nom Complet</Label>
            <Input 
              id="name" 
              placeholder="Jean Dupont" 
              className="h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

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
            <Label htmlFor="password" className="text-muted-foreground ml-1">Mot de passe</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="role" className="text-muted-foreground ml-1">Vous êtes :</Label>
            <div className="relative">
                <select 
                    id="role"
                    className="flex h-12 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="student" className="text-black dark:text-white bg-background">Étudiant</option>
                    <option value="teacher" className="text-black dark:text-white bg-background">Enseignant</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
                    ▼
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-8 flex-col gap-4">
          <Button type="submit" size="lg" className="w-full h-12 text-md" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
             Déjà un compte ? <a href="/login" className="text-primary hover:underline">Se connecter</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
