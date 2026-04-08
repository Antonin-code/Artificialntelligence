import Link from "next/link"
import { MapPin, LayoutDashboard, Users, User, LogIn, LogOut } from "lucide-react"
import { signOut } from "@/lib/actions"
import { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar({ user, role, status }: { user: SupabaseUser | null, role?: string, status?: string }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            StudCall
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {status === 'approved' && role === 'admin' && (
            <>
              <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors">
                <LayoutDashboard className="h-4 w-4" /> Admin
              </Link>
              <Link href="/teacher" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Users className="h-4 w-4" /> Enseignant
              </Link>
              <Link href="/student" className="flex items-center gap-2 hover:text-primary transition-colors">
                <User className="h-4 w-4" /> Étudiant
              </Link>
            </>
          )}
          {status === 'approved' && role === 'teacher' && (
              <Link href="/teacher" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Users className="h-4 w-4" /> Enseignant
              </Link>
          )}
          {status === 'approved' && role === 'student' && (
              <Link href="/student" className="flex items-center gap-2 hover:text-primary transition-colors">
                <User className="h-4 w-4" /> Étudiant
              </Link>
          )}
        </div>
        <div className="flex items-center">
          {user ? (
            <form action={signOut}>
              <button type="submit" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-red-400 transition-all px-4 py-2 rounded-full border border-white/5 hover:border-red-400/20 bg-white/5">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Se déconnecter</span>
              </button>
            </form>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all border border-primary/20">
              <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Se connecter</span>
            </Link>
          )}
        </div>
      </div>
      {/* Mobile nav indicator */}
      <div className="md:hidden flex items-center justify-center gap-4 py-3 border-t border-white/5 bg-background/40">
          {status === 'approved' && role === 'admin' && (
            <>
              <Link href="/admin" className="text-xs font-medium text-muted-foreground hover:text-primary">Admin</Link>
              <Link href="/teacher" className="text-xs font-medium text-muted-foreground hover:text-primary">Enseignant</Link>
              <Link href="/student" className="text-xs font-medium text-muted-foreground hover:text-primary">Étudiant</Link>
            </>
          )}
          {status === 'approved' && role === 'teacher' && (
              <Link href="/teacher" className="text-xs font-medium text-muted-foreground hover:text-primary">Enseignant</Link>
          )}
          {status === 'approved' && role === 'student' && (
              <Link href="/student" className="text-xs font-medium text-muted-foreground hover:text-primary">Étudiant</Link>
          )}
      </div>
    </nav>
  )
}
