"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitAttendance } from "@/lib/actions"
import { getDistanceClient } from "@/lib/utils"

interface StudentDashboardProps {
  activeSession: any; // Session type from Supabase would be better
  studentId: string;
  alreadyMarked?: boolean;
}

export function StudentDashboard({ activeSession, studentId, alreadyMarked }: StudentDashboardProps) {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    if (activeSession && !alreadyMarked) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          (err) => setError("Veuillez autoriser la géolocalisation pour émarger.")
        )
      } else {
        setError("Géolocalisation non supportée par votre navigateur.")
      }
    }
  }, [activeSession, alreadyMarked])

  if (alreadyMarked || status === "success") {
    return (
      <Card className="border-green-500/30 bg-green-500/5 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
        <CardHeader className="text-center py-10">
          <div className="mx-auto w-20 h-20 bg-green-500/20 text-green-500 flex items-center justify-center rounded-full mb-6 relative">
            <span className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-pulse"></span>
            <CheckCircle2 size={40} />
          </div>
          <CardTitle className="text-3xl font-extrabold text-green-500/90 mb-2">Présence Validée !</CardTitle>
          <CardDescription className="text-lg">
            {alreadyMarked 
              ? `Vous êtes bien enregistré pour le cours de ${activeSession?.groups?.name || 'votre groupe'}.`
              : "Votre présence vient d&apos;être enregistrée avec succès."}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!activeSession) {
    return (
      <Card className="glass-panel text-center py-16 px-4">
        <CardContent className="flex flex-col items-center justify-center text-muted-foreground p-0">
            <AlertCircle size={56} className="mb-6 opacity-40 text-primary" />
            <p className="text-xl font-medium">Aucune session d&apos;appel active</p>
            <p className="text-base mt-2">Attendez que votre enseignant lance l&apos;appel pour votre groupe.</p>
        </CardContent>
      </Card>
    )
  }

  const handleAttendance = async () => {
    if (!location) return;
    setStatus("loading")
    
    // Simulate real delay
    await new Promise(r => setTimeout(r, 800))
    
    // If no Supabase connection is set, bypass logic for UI demonstration.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
       setStatus("success");
       return;
    }

    const dist = getDistanceClient(location.lat, location.lon, activeSession.latitude, activeSession.longitude)
    setDistance(Math.round(dist))

    if (dist <= activeSession.radius) {
      await submitAttendance(activeSession.id, studentId)
      setStatus("success")
    } else {
      setStatus("error")
      setError(`Vous êtes à ${Math.round(dist)}m de l&apos;école. Vous devez être dans un rayon de ${activeSession.radius}m.`)
    }
  }

  return (
    <Card className="glass-panel shadow-2xl relative overflow-hidden border border-white/5">
      <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-500" />
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                    Appel en cours
                </CardTitle>
                <CardDescription className="text-base font-medium flex items-center gap-1.5">
                    <span className="text-muted-foreground">Cours :</span> 
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md">{activeSession.groups.name}</span>
                </CardDescription>
            </div>
            <div className="animate-pulse bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                EN DIRECT
            </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
            <div role="alert" aria-live="assertive" className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex gap-3 text-sm">
                <XCircle className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
            </div>
        )}
        
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-5 shadow-inner">
            <div className={`p-4 rounded-2xl ${location ? 'bg-primary/20 text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/5 text-muted-foreground'}`}>
                <MapPin className={!location ? 'animate-bounce' : ''} />
            </div>
            <div>
                <h4 className="font-semibold text-lg" aria-live="polite">{location ? "Position de votre appareil" : "Recherche GPS en cours..."}</h4>
                <p className="text-sm text-muted-foreground mt-1 font-mono" aria-live="polite">
                    {location 
                        ? `Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}` 
                        : "Veuillez autoriser l&apos;accès au navigateur."}
                </p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-8 px-6">
        <Button 
            size="lg" 
            className={`w-full text-lg h-14 rounded-xl transition-all duration-300 ${!location || status === "loading" ? 'opacity-80' : 'hover:scale-[1.02]'}`}
            disabled={!location || status === "loading"}
            onClick={handleAttendance}
            aria-busy={status === "loading"}
        >
            {status === "loading" ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
            Confirmer ma présence (à moins de {activeSession.radius}m)
        </Button>
      </CardFooter>
    </Card>
  )
}
