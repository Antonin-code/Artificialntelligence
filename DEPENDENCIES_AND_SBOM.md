# Audit de Dépendances et Nomenclature (SBOM) - US34

Afin d'assurer une traçabilité conforme aux exigences d'entreprise (SecOps/Compliance), ce document consigne l'utilité des paquets tiers majeurs et détaille les procédures pour maintenir et auditer ces dépendances.

## 1. Inventaire des Dépendances
Les paquets inutilisés (ex: `@radix-ui/react-icons`) ont été identifiés et retirés pour limiter la surface d'attaque et l'encombrement (bloatware).

Voici la cartographie des composants principaux retenus pour **StudCall** :

- **Noyau Applicatif :**
  - `next` (v14), `react`, `react-dom` : Base du Framework.

- **UI & Composants Visuels :**
  - `tailwindcss`, `autoprefixer`, `postcss` : Moteur de style.
  - `lucide-react` : Librairie universelle d'icônes retenue pour le projet.
  - `@radix-ui/*` (react-slot, react-label) : Primitives open-source accessibles (a11y) requises par Shadcn UI.
  - `class-variance-authority`, `clsx`, `tailwind-merge` : Utilitaires fonctionnels pour la fusion des classes CSS conditionnelles (architecture standard Shadcn).

- **Authentification & Données :**
  - `@supabase/supabase-js`, `@supabase/ssr` : Clients pour communiquer directement avec la base de données as-a-service et gérer les sessions côté serveur.

## 2. Procédure de Génération SBOM
La *Software Bill of Materials* (SBOM) chiffre très précisément la chaîne logistique logicielle.

**Format reconnu utilisé :** CycloneDX (format JSON supporté par l'OWASP).

**Mise à jour de la SBOM :**
Si vous ajoutez une dépendance, vous pouvez regénérer l'inventaire en pointant vers le conteneur cible, via cet outil officiel :
```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.json
```
> Le fichier généré (`studcall/sbom.json`) doit de préférence être poussé via la CI/CD pour une analyse d'artefacts automatisée (ex: Sonatype, Trivy, ou DefectDojo).

## 3. Revue de Vulnérabilités (CVEs)
Une procédure d'audit continue doit être enclenchée sur l'environnement de développement et de build.

**Commandes usuelles :**
```bash
# Lance un audit profond sur votre arbre d'installation
npm audit

# Répare automatiquement les mineures (Patch) sans casser le SemVer
npm audit fix
```
### Étude à T=0
L'audit exécuté (consultable via `audit-report.txt` généré provisoirement) assure qu'il n'y a pas de menaces critiques en cours non adressées de manière intentionnelle sur le code principal déployé. La documentation ci-dessus servira de socle pour toute évolution architecturale.
