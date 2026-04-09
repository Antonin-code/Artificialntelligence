# StudCall - L'appel automatique par proximité géographique

Bienvenue sur la documentation centrale du projet **StudCall**. Ce document consolide toutes les informations nécessaires pour l'installation, l'exploitation et la maintenance du produit, conformément aux recommandations de l'Équipe projet (US37).

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
cd Artificialntelligence/studcall

# Installer les dépendances
npm install
```

### Variables d'Environnement
Créer un fichier `.env.local` à la racine du dossier `studcall/` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://<votre-id-projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-cle-anonyme>
# Ajouter toutes autres variables sécurisées nécessaires
```
*(Nb. Aucune variable d'environnement sensible ne doit être ajoutée ou poussée sur le dépôt GIT.)*

---

## 4. Exploitation et Lancement

### 🖥️ Lancement Local (Développement)
Pour exécuter le projet en environnement de développement :
```bash
# Depuis le répertoire studcall/
npm run dev
```
L'application est servie sur : `http://localhost:3000`

### 🐳 Lancement Conteneurisé (Docker)
*(Si un `Dockerfile` est ajouté au projet)*
- **Démarrage :** `docker-compose up --build -d` (ou `docker build -t studcall . && docker run -p 3000:3000 studcall`)
- **Arrêt :** `docker-compose down` (ou arrêter le conteneur via `docker stop <id>`)

### 📜 Journaux (Logs) et Monitoring
- En local, les journaux s'affichent directement dans la console d'exécution Node.js ou Next.js.
- En production, les journaux serveurs de Vercel/Docker devront être consultés depuis leur tableau de bord.
- Les logs de sécurité Supabase sont consultables dans le dashboard Supabase (section *Auth*).

### ⚠️ Limites Connues
- **GPS et Navigateur :** La *Geolocation API* des navigateurs nécessite un contexte sécurisé (HTTPS ou `localhost`). Si déployé sans HTTPS, le navigateur bloquera la demande de localisation de l'étudiant.
- **Précision GPS :** En intérieur, la géolocalisation mobile peut avoir une marge d'erreur pouvant atteindre 20 à 30 mètres, ce qui nécessite une configuration du rayon de l'école assez robuste (ex: 100-150m).

---

## 5. Tests et Qualité

L'absence de régression et la qualité du code sont garanties par :
```bash
# Vérification de linting et de typage
npm run lint

# Lancement des tests unitaires et intégration (Vitest)
npm run test
```
*Voir le fichier `CODE_QUALITY_STANDARDS.md` pour le comportement attendu.*

---

## 6. Sécurité

Conformément à la politique globale (via `AGENT_SAFEGUARDS.md`), la philosophie du moindre privilège s'applique :
- **Secrets :** Mots de passe, clés secrètes non publiques doivent être proscrits du code et être uniquement dans `.env.local`.
- **Rôle RBAC :** L'assignation de rôles (`admin`, `teacher`, `student`) conditionne impérativement les layouts et les requêtes (via Next Middleware et RLS Supabase).
- Toute dépendance est strictement supervisée pour contrer les menaces liées à la *supply chain*.

---

## 7. Livraison et CI/CD

Le cycle de livraison adhère de façon stricte aux **Conventional Commits** :
- **Format attendu :** `<type>(<scope>): <sujet>` (ex: `feat(auth): ajout login OAuth`)
- L'atomicité (1 idée = 1 commit) est obligatoire (US18).
- Branching par fonctionnalité (ex: `storys` ou branch/us_id) et validation par Merge Request ou Pull Request.
- **Intégration Continue (à venir) :** Tout *push* devra exécuter par défaut le `lint`, le `test` et des scans de sécurité Sonar.

---
Ce document pourra servir de référence unique à tout jury d'évaluation ou nouveau développeur pour s'immerger promptement dans le projet StudCall !
