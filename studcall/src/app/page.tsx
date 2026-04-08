import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 text-center max-w-3xl glass-panel p-10 sm:p-16 rounded-3xl border border-white/5">
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/20 rounded-full border border-primary/30">
               <MapPin className="text-primary w-12 h-12" />
            </div>
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-blue-400 drop-shadow-sm">
          StudCall
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground mb-10 font-light leading-relaxed">
          L'appel automatique par proximité géographique. Gagnez du temps administratif, sécurisez la présence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 rounded-full h-14">
              Accéder à la plateforme
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
              <MapPin size={24} />
            </div>
            <h3 className="font-semibold text-lg">Géolocalisé</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Vérification de la présence via les coordonnées GPS des étudiants.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/20">
              <Clock size={24} />
            </div>
            <h3 className="font-semibold text-lg">Temps Réel</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Suivi instantané des présents et absents sur le dashboard enseignant.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/20">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-semibold text-lg">100% Autonome</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Les étudiants valident eux-mêmes. Fini l'appel manuel chronophage.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
