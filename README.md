# StudCall - Projet d'Emargement Géolocalisé

## Présentation
StudCall est une application moderne permettant de gérer l'émargement des étudiants en utilisant la géolocalisation pour valider leur présence.

## Stack Technique
- **Frontend** : Next.js 14 (App Router)
- **Backend/Base de données** : Supabase
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **Tests** : Vitest + React Testing Library

## Structure du Projet
- `src/app` : Routes et pages de l'application (Admin, Teacher, Student)
- `src/components` : Composants UI réutilisables (shadcn/ui style)
- `src/lib` : Utilitaires et configuration (Supabase, helpers)
- `src/test` : Configuration des tests et tests globaux
- `supabase` : Migrations et configuration de la base de données

## Démarrage Rapide

### Installation
```bash
npm install
```

### Configuration
Copiez le fichier `.env.example` en `.env.local` et remplissez les variables Supabase.

### Développement
```bash
npm run dev
```

### Tests
```bash
npm run test        # Exécuter les tests une fois
npm run test:watch  # Mode interactif
```

### Qualité (Linter)
```bash
npm run lint
```

## Conventions de Code
- Utilisation de TypeScript pour la robustesse.
- Séparation stricte entre composants UI et logique métier.
- Nommage explicite et documentation du "POURQUOI" (voir `CODE_QUALITY_STANDARDS.md`).
