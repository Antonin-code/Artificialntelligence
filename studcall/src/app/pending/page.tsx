import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PendingPage({ searchParams }: { searchParams: { status?: string } }) {
  const isRejected = searchParams.status === 'rejected';

  return (
    <div className="flex min-h-[90vh] items-center justify-center p-4">
      <Card className="max-w-md w-full glass-panel shadow-2xl border-white/10 text-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${isRejected ? 'bg-red-500' : 'bg-yellow-500'}`} />
        <CardHeader className="pt-10 pb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 ${isRejected ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
            {isRejected ? <ShieldAlert size={40} /> : <Clock size={40} />}
          </div>
          <CardTitle className="text-2xl font-bold">{isRejected ? 'Inscription Refusée' : 'Compte en attente'}</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-4">
            {isRejected 
              ? "Votre demande d'inscription a été refusée par l'administration. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre scolarité."
              : "Votre inscription a bien été enregistrée mais nécessite la validation manuelle d'un administrateur avant que vous puissiez accéder à la plateforme. Merci de réessayer plus tard."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
            <Link href="/">
              <Button variant="outline" className="w-full h-12">Retour à l'accueil</Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  )
}
