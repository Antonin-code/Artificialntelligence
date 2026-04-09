# StudCall - L'appel automatique par proximité géographique

Bienvenue sur la documentation centrale du projet **StudCall**. StudCall est une application moderne permettant de gérer l'émargement des étudiants en utilisant la géolocalisation pour valider leur présence.

---

## 1. Vision et Périmètre

**Problème résolu :** La perte de temps administratif lors de l'appel manuel dans les établissements scolaires.
**Valeur principale :** Permettre aux élèves de s'émarger en toute autonomie via leur smartphone ou ordinateur, sous condition d'être physiquement présents dans le périmètre autorisé de l'école (Géolocalisation).

**Utilisateurs cibles :**
- **Administrateurs :** Gèrent les comptes (enseignants/élèves) et les groupes.
- **Enseignants :** Ouvrent et gèrent les sessions d'appel.
- **Étudiants :** Valident leur présence par géolocalisation.

---

## 2. Architecture & Technologies

Le projet repose sur une approche de type *Backend-as-a-Service* avec une interface moderne :
- **Framework Front/Back :** Next.js 14+ (App Router) en TypeScript
- **Interface UI :** Tailwind CSS, Shadcn UI, Radix UI, Lucide Icons
- **Backend & Base de données :** Supabase (Authentication, PostgreSQL)
- **Logique Métier/Hardware :** Geolocation API (Navigateur), calcul de distance (Haversine)
- **Tests :** Vitest, React Testing Library

---

## 3. Prérequis et Installation

### Prérequis Systèmes
- **Node.js** (v18.x ou supérieur)
- **npm** (inclus avec Node.js)
- **Git**
- **Instance Supabase** (Cloud ou Locale avec Supabase CLI)

### Dépendances et Code Source
```bash
# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd Artificialntelligence

# Installer les dépendances
npm install
```

### Variables d'Environnement
Créer un fichier `.env.local` à la racine du projet :
```env
NEXT_PUBLIC_SUPABASE_URL=https://<votre-id-projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-cle-anonyme>
```
*(Nb. Aucune variable d'environnement sensible ne doit être ajoutée ou poussée sur le dépôt GIT.)*

---

## 4. Exploitation et Lancement

### 🖥️ Lancement Local (Développement)
```bash
npm run dev
```
L'application est servie sur : `http://localhost:3000`

### 📜 Journaux (Logs) et Monitoring
- En local, les journaux s'affichent directement dans la console d'exécution Node.js ou Next.js.
- Les logs de sécurité Supabase sont consultables dans le dashboard Supabase.

### ⚠️ Limites Connues
- **GPS et Navigateur :** La *Geolocation API* des navigateurs nécessite un contexte sécurisé (HTTPS ou `localhost`).
- **Précision GPS :** En intérieur, la géolocalisation mobile peut avoir une marge d'erreur pouvant atteindre 20 à 30 mètres (Tolérance de 10m appliquée côté serveur).

---

## 5. Tests et Qualité
```bash
# Vérification de linting et de typage
npm run lint

# Lancement des tests (Vitest)
npm run test
```

---

## 6. Structure du Projet
- `src/app` : Routes et pages de l'application.
- `src/components` : Composants UI réutilisables.
- `src/lib` : Utilitaires et configuration.
- `src/test` : Configuration des tests.
- `prisma` : Schéma de la base de données (documentation).
- `supabase` : Migrations et configuration SQL.
