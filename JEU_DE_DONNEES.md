# Documentation du Jeu de Données de Démonstration (US27)

Ce document décrit le jeu de données préparé pour tester l'application **StudCall** et réaliser des démonstrations exhaustives sans manipuler de données sensibles en production.

## 1. Contexte Éducatif (Cohérence)
Le jeu de données reflète une situation scolaire réelle avec des profils clairs :
- **Enseignant(e) :** `professeur@ecole.fr` (Gère la classe et lance l'appel).
- **Étudiants :**
  - `etudiant.present@ecole.fr` (Bob - Simulé dans le périmètre autorisé).
  - `etudiant.absent@ecole.fr` (Alice - Absente ou en retard).
  - `etudiant.erreur@ecole.fr` (Charlie - Simulé hors périmètre géographique).
- **Groupe :** "Master 2 - Développement IA"
- **Lieu standard (Mock) :** Les coordonnées GPS de l'établissement (ex: Campus universitaire).

## 2. Cas d'usage couverts (Les Scénarios)

Ce jeu de données a été construit pour vérifier l'entièreté des retours UI et métiers :

1. **Cas Nominal (Le parcours heureux) :**
   - L'enseignant ouvre une session pour le "Master 2".
   - `etudiant.present` se connecte. Son GPS correspond à la tolérance (ex: < 100m). 
   - Résultat : Sa présence est immédiatement marquée (UI Succès).

2. **État Vide (Empty State) :**
   - `etudiant.absent` se connecte à 8h00.
   - L'enseignant n'a **pas encore ouvert** l'appel.
   - Résultat : L'étudiant voit un écran "Aucune session d'appel active" proprement mis en page, il ne peut pas forcer le bouton.

3. **Cas d'Erreur (Hors périmètre / GPS Perdu) :**
   - `etudiant.erreur` tente de confirmer sa présence, mais son appareil simule être à 500m de l'école (soit au-delà du `radius` défini sur la session).
   - Résultat : Un message d'alerte bloque sa présence ("Vous êtes trop loin de l'école").
   - *Une autre subtilité intégrée au test :* Le refus des droits de géolocalisation sur le navigateur affiche bien une alerte non bloquante visuellement.

## 3. Procédure d'Initialisation et de Chargement

Dans le cadre de cette architecture (Next.js + Supabase), voici comment réinitialiser la base de démonstration de manière fiable :

### Chargement automatisé (via Supabase CLI)
Si vous travaillez avec la base locale :
1. Copiez les données mouchardes dans le fichier `supabase/seed.sql` (les insertions SQL pour Users, Groups, Group_Student).
2. Lancez la commande :
   ```bash
   npx supabase db reset
   ```
   *Ce script va ré-appliquer `schema.sql` puis insérer les profils du `seed.sql` instantanément.*

### Chargement manuel (via Dashboard Supabase)
Si vous utilisez le projet Cloud hébergé :
1. Rendez-vous dans la section **SQL Editor** de l'interface Supabase.
2. Collez le bloc de requêtes standard de test (contenant l'insertion des comptes par défaut avec `crypt('password123', gen_salt('bf'))`).
3. Cliquez sur **Run**.

## 4. Exploitation en Démonstration / Soutenance

Pour impressionner le jury ou démontrer rapidement les fonctionnalités :
1. **Étape 1 :** Connectez-vous d'abord en tant que `professeur@ecole.fr` sur un écran (ou un navigateur principal) et lancez l'appel.
2. **Étape 2 :** Sur un téléphone mobile ou dans une fenêtre de navigation privée (avec les outils de simulation GPS Chrome activés), connectez-vous avec `etudiant.present@ecole.fr` pour jouer la géolocalisation.
3. **Étape 3 :** Changez vite les fausses coordonnées de Chrome (via *Sensors > Location* dans les DevTools) pour simuler l'étudiant et montrer l'échec direct !
