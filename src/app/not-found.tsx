import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full glass-panel shadow-2xl border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <CardHeader className="pt-10 pb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
            <Search size={40} />
          </div>
          <CardTitle className="text-2xl font-bold">Page Introuvable</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-4">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
            <Link href="/">
              <Button className="w-full h-12 shadow-lg shadow-primary/20">Retour à l&apos;accueil</Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  )
}
