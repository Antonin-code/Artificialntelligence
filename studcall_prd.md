PRD : StudCall - Émargement Autonome Géolocalisé
1. Vue d'ensemble
Nom : StudCall

Baseline : L'appel automatique par proximité géographique.

Problème résolu : Perte de temps administratif lors de l'appel manuel en cours d'informatique.

Utilisateur cible : Administrateurs, Enseignants et Étudiants.

Valeur principale : Permettre aux élèves d'émerger eux-mêmes uniquement s'ils sont physiquement présents à l'école.

2. Fonctionnalités Core (MVP)
Gestion centralisée : L'Admin crée, modifie et supprime les comptes (Enseignant/Élève) et les Groupes.

Authentification sécurisée : Connexion via email/password pour tous les rôles.

Création de session d'appel : L'Enseignant active l'émargement pour un Groupe spécifique à un instant T.

Émargement géolocalisé : L'Élève valide sa présence via un bouton si ses coordonnées GPS sont dans le périmètre autorisé.

Export de présence : L'Enseignant visualise la liste des élèves présents/absents en temps réel.

3. Écrans & Flux Utilisateur
Connexion : Formulaire (email, password). Redirection selon le rôle (admin, teacher, student).

Dashboard Admin : Tableaux CRUD pour Utilisateurs et Groupes. Boutons "Ajouter", "Éditer", "Supprimer".

Dashboard Enseignant : Liste des Groupes assignés. Bouton "Lancer l'appel" pour un groupe. Vue "Statistiques" montrant la liste des élèves avec statut (Présent/Absent).

Dashboard Étudiant : État de la session (Ouverte/Fermée). Si Ouverte : Bouton "Confirmer ma présence". Si confirmée : Message de succès.

Géolocalisation : Pop-up de demande d'autorisation GPS dès l'entrée sur le Dashboard Étudiant.

4. Modèle de données
User :

id : string (uuid)

email : string (unique)

password : string (hashed)

role : enum["admin", "teacher", "student"]

name : string

Group :

id : string (uuid)

name : string

teacher_id : string (FK User.id)

Group_Student (Table de jointure) :

group_id : string (FK Group.id)

student_id : string (FK User.id)

AttendanceSession :

id : string (uuid)

group_id : string (FK Group.id)

created_at : Date

is_active : boolean

latitude : number (centre de l'école)

longitude : number (centre de l'école)

radius : number (en mètres, défaut: 100)

AttendanceRecord :

id : string (uuid)

session_id : string (FK AttendanceSession.id)

student_id : string (FK User.id)

status : enum["present"]

timestamp : Date

5. Logique Métier
SI un utilisateur tente de se connecter ALORS vérifier les credentials et rediriger vers le layout correspondant au role.

SI un Enseignant clique sur "Lancer l'appel" ALORS créer une AttendanceSession active avec les coordonnées GPS actuelles de l'enseignant ou de l'école.

SI un Étudiant clique sur "Confirmer ma présence" :

SI la distance entre (GPS_Étudiant) et (GPS_Session) <= radius ALORS créer un AttendanceRecord et afficher "Présence validée".

SINON afficher "Vous êtes hors de la zone de l'école".

SI l'Enseignant clique sur "Clôturer" ALORS passer is_active à false.

6. Stack & Contraintes Techniques
Framework : Next.js 14+ (App Router).

Langage : TypeScript.

UI/Styling : Tailwind CSS + Shadcn UI.

Persistance : Supabase (Auth + PostgreSQL).

Géolocalisation : API Browser navigator.geolocation.

Calcul de distance : Formule de Haversine via une librairie légère ou utilitaire TS.

7. Critères d'Acceptation
L'Admin peut créer un compte Étudiant fonctionnel.

Un Enseignant peut ouvrir une session de 100m de rayon.

Un Étudiant simulé à 50m peut émarger.

Un Étudiant simulé à 500m reçoit un message d'erreur.

L'interface est totalement responsive (mobile-first pour les étudiants).