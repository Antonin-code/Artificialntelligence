1. Dashboard Étudiant (Mobile-First)

L'objectif est de réduire la friction au minimum : l'élève doit pouvoir émarger en 2 taps.

Informations affichées

Statut de la session : Indicateur visuel (Badge animé si actif).
Nom du cours / Groupe : Ex: "C# Avancé - Groupe A".
État du GPS : Indicateur de précision ou bouton discret "Recalibrer".

Distance relative : Message textuel dynamique (ex: "Vous êtes à l'école" ou "À 450m de la zone").
Historique rapide : Date et heure du dernier émargement réussi.
Actions possibles
Action principale : Bouton Confirmer ma présence (Large, centré, avec état de chargement/spinner).
Action secondaire : Bouton Rafraîchir ma position (si le GPS a dérivé).

Design de l'état d'erreur (ex: 500m)
Feedback Immédiat : Le bouton d'émargement devient grisé ou se transforme en bouton d'alerte.
Illustration/Icône : Une icône de géolocalisation barrée ou une carte simplifiée avec un cercle rouge.

Texte explicatif : "Zone non atteinte : Vous devez être à moins de 100m du centre de l'école. Distance actuelle : 520m."
Action corrective : Lien ou bouton "Pourquoi ma position est incorrecte ?" menant à une aide.

2. Dashboard Enseignant

L'objectif est la supervision en un coup d'œil et le contrôle total du temps pédagogique.

Informations affichées
Sélecteur de Groupe : Liste déroulante des classes assignées.
Compteur de Présence (Real-time) : Jauge de progression (ex: "18 / 25 élèves émargés").

Statut de la session active : Temps écoulé depuis le lancement de l'appel.

Liste détaillée : Tableau avec Nom, Heure d'émargement et Statut (Présent/Absent).

Actions possibles
Lancer l'appel : Bouton d'action principal (Primary).
Clôturer l'appel : Bouton de fin de session (Destructive).
Export CSV/PDF : Bouton secondaire pour générer le rapport.
Forcer l'émargement : Bouton d'édition manuel pour un élève spécifique (en cas de problème technique GPS).
Design de l'état d'erreur (ex: GPS désactivé)
Bannière d'alerte (Top-bar) : "Le GPS est requis pour définir le centre de la session. Veuillez l'activer dans votre navigateur."
Empty State : Si aucun groupe n'est assigné : "Aucun groupe trouvé. Contactez l'administrateur."

3. Guide UI Simplifié (Shadcn + Tailwind)

Palette de Couleurs Sémantiques

État	Couleur Tailwind	Utilisation
Succès	text-emerald-500 / bg-emerald-50	Présence validée, Session lancée.

Erreur	text-destructive / bg-destructive/10	Hors zone, GPS désactivé.

En cours	text-amber-500 / bg-amber-50	GPS en cours d'acquisition, Session en attente.

Info	text-blue-500	Informations sur le cours, tutoriel.

Styles des Composants Shadcn

Bouton d'émargement (Étudiant) :
Style : Button size="lg" className="w-full py-8 text-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"

Bouton Clôturer (Enseignant) :
Style : Button variant="destructive" size="sm" className="gap-2"

Statut Badge :
Style (Session Ouverte) : Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"
Style (Session Close) : Badge variant="secondary" className="opacity-50"

Micro-Interactions
Pulsation : Le bouton d'un étudiant pulse doucement lorsqu'une session est détectée à proximité.
Haptic Feedback : Vibration légère lors du succès de l'émargement (sur navigateurs mobiles compatibles).