'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldAlert, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full glass-panel shadow-2xl border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-destructive" />
        <CardHeader className="pt-10 pb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 text-destructive flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
            <ShieldAlert size={40} />
          </div>
          <CardTitle className="text-2xl font-bold">Oups ! Une erreur est survenue</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-4">
            L&apos;application a rencontré un problème technique imprévu. Nos équipes ont été notifiées (via les logs).
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 space-y-4">
            <Button 
                onClick={() => reset()} 
                className="w-full h-12 gap-2"
            >
                <RotateCcw size={18} /> Réessayer
            </Button>
            <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'} 
                className="w-full text-muted-foreground"
            >
                Retour à l&apos;accueil
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}
