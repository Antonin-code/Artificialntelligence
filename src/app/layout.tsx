import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import { ToastProvider } from "@/components/ui/toaster-minimal"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudCall - Émargement Autonome Géolocalisé',
  description: 'L\'appel automatique par proximité géographique. Gagnez du temps administratif.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let dbUser = null
  if (user) {
      const { data } = await supabase.from('users').select('role, status').eq('id', user.id).single()
      dbUser = data
  }

  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
          <ToastProvider>
            <Navbar user={user} role={dbUser?.role} status={dbUser?.status} />
            {children}
          </ToastProvider>
        </div>
      </body>
    </html>
  )
}
