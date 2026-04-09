import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Users, 
  Smartphone,
  ChevronRight,
  Mail,
  GraduationCap
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">StudCall</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground transition-colors">
            <Link href="#problem" className="hover:text-primary">Le Problème</Link>
            <Link href="#benefits" className="hover:text-primary">Bénéfices</Link>
            <Link href="#how-it-works" className="hover:text-primary">Fonctionnement</Link>
            <Link href="#contact" className="hover:text-primary">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">Connexion</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Section 1: Accroche (Hero) & Proposition de Valeur */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="outline" className="mb-6 py-1 px-4 border-primary/30 bg-primary/5 text-primary">
              🚀 Pour les Enseignants et Étudiants Tech
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              L'appel automatique par <br className="hidden md:block" />
              <span className="text-primary">proximité géographique.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              Sécurisez la présence en un clic. StudCall automatise l'émargement pour vous permettre de vous concentrer sur ce qui compte : la transmission du savoir.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg px-8 py-7 rounded-full shadow-xl shadow-primary/20">
                  Accéder à la plateforme
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Le Problème */}
        <section id="problem" className="py-24 bg-muted/30 border-y border-white/5">
          <div className="container mx-auto px-4 text-center">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Le constat</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight">
              15 minutes de perdues par cours. <span className="text-destructive underline decoration-2 underline-offset-8">C'est terminé.</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                L'appel manuel est une relique chronophage du passé. Pour un cours de 2h, vous perdez 12% de votre temps pédagogique en tâches administratives. StudCall réduit ce temps à **zéro**.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Bénéfices */}
        <section id="benefits" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">La valeur ajoutée</h2>
              <p className="text-muted-foreground text-lg">Trois piliers pour un émargement sans faille.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <CardTitle>Fiabilité Totale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Géofencing strict basé sur la formule de Haversine. Pas de triche possible : l'étudiant doit être physiquement présent.</p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <CardTitle>Rapidité Extrême</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Émargement en un clic. En moins de 3 secondes, la présence est validée et synchronisée avec la base de données.</p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <CardTitle>Transparence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Feedback immédiat pour l'étudiant et tableau de bord en temps réel pour l'enseignant. Fini les doutes.</p>
                </CardContent>
              </Card>
            </div>
              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <CardTitle>100% Autonome</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Les étudiants valident eux-mêmes. Fini l'appel manuel chronophage pour l'enseignant.</p>
                </CardContent>
              </Card>
              <div className="hidden">
                <span>Géolocalisé</span>
                <span>Temps Réel</span>
              </div>
          </div>
        </section>

        {/* Section 4: Usage (Fonctionnement) */}
        <section id="how-it-works" className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Mode d'emploi</h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
               {[
                 { step: 1, title: "Lancement", desc: "L'enseignant ouvre une session (rayon de 100m).", icon: <Zap className="w-6 h-6" /> },
                 { step: 2, title: "GPS", desc: "L'étudiant active son GPS sur son smartphone.", icon: <Smartphone className="w-6 h-6" /> },
                 { step: 3, title: "Validation", desc: "La présence est enregistrée instantanément.", icon: <CheckCircle2 className="w-6 h-6" /> }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary">
                       {item.step}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Section 5: Accès / Contact */}
        <section id="contact" className="py-24 relative overflow-hidden text-center">
          <div className="container mx-auto px-4 z-10 relative">
             <div className="glass-panel max-w-4xl mx-auto p-12 rounded-[3rem] border-white/10">
                <h2 className="text-3xl md:text-5xl font-black mb-6">Prêt à transformer vos cours ?</h2>
                <p className="text-xl text-muted-foreground mb-10">
                  Contactez-nous pour une démonstration ou créez votre compte enseignant dès aujourd'hui.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                   <Button size="lg" className="rounded-full px-12 h-14">
                      Démarrer gratuitement
                   </Button>
                   <Button variant="outline" size="lg" className="rounded-full px-12 h-14 border-white/10">
                      <Mail className="mr-2 w-5 h-5" />
                      Nous contacter
                   </Button>
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-muted-foreground text-sm">
        <p>© 2026 StudCall - L'appel intelligent pour l'éducation moderne.</p>
      </footer>
    </div>
  );
}
