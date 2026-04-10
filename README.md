<div align="center">
  <img src="./studcall_logo_1775805578453.png" alt="StudCall Logo" width="200" />
  <h1>🚀 StudCall</h1>
  <p><strong>L'appel automatisé par proximité géographique.</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![Typescript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

---

## 📖 À propos

**StudCall** est une solution moderne destinée aux établissements scolaires pour simplifier et sécuriser la prise de présence. En s'appuyant sur la **Géo-validation**, l'application permet aux étudiants de valider leur présence en un clic, uniquement s'ils se trouvent dans le périmètre défini par l'enseignant.

### 🌟 Points forts
- **Gain de temps** : Fini l'appel manuel interminable.
- **Fiabilité** : Validation par coordonnées GPS précises.
- **Transparence** : Historique des présences consultable en temps réel par les enseignants et les élèves.
- **Flexibilité** : Fonctionne sur n'importe quel appareil doté d'un navigateur moderne.

---

## ✨ Fonctionnalités

### 👨‍🏫 Pour les Enseignants
- **Gestion des Groupes** : Créez et gérez vos classes facilement.
- **Ouverture de session** : Lancez un appel en définissant une position et un rayon de tolérance.
- **Monitoring en direct** : Visualisez qui s'est émargé en temps réel.
- **Clôture sécurisée** : Fermez les sessions manuellement ou automatiquement.

### 🎓 Pour les Étudiants
- **Émargement rapide** : Un bouton unique pour valider sa présence.
- **Tableau de bord** : Suivi des absences et des participations.
- **Profil personnel** : Gestion des informations de compte.

### 🛡️ Pour les Administrateurs
- **Validation des comptes** : Système d'approbation pour garantir la sécurité.
- **Gestion globale** : Supervision de l'ensemble de la plateforme.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), React 18, Tailwind CSS.
- **Composants** : Radix UI, Lucide React, Shadcn/UI.
- **Backend & Database** : Prisma ORM, MySQL, Supabase (Auth).
- **Infrastructure** : Docker & Docker Compose.
- **Tests** : Vitest, React Testing Library.

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (recommandé pour la base de données)
- [Git](https://git-scm.com/)

### 2. Installation
```bash
# Cloner le projet
git clone https://github.com/Antonin-code/Artificialntelligence.git

# Accéder au dossier
cd Artificialntelligence

# Installer les dépendances
npm install
```

### 3. Configuration
Créez un fichier `.env.local` à la racine :
```env
# Database (si usage local)
DATABASE_URL="mysql://root:root_password@localhost:3306/studcall_db"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Lancement avec Docker (Recommandé)
```bash
# Lance l'application et la base de données MySQL
docker-compose up -d
```
L'application sera disponible sur `http://localhost:3000`.

### 5. Lancement Développement (Sans Docker)
```bash
# Lancer le serveur de dev
npm run dev
```

---

## 📁 Structure du Projet

```text
.
├── prisma/             # Schéma et migrations de la base de données
├── src/
│   ├── app/           # Routes et Pages (App Router)
│   ├── components/    # Composants UI réutilisables
│   ├── lib/           # Utilitaires et configuration (Supabase, Prisma)
│   └── types/         # Définitions TypeScript
├── public/            # Assets statiques
├── MD/                # Documentation détaillée par US
└── docker-compose.yml # Configuration de l'infrastructure
```

---

## 🧪 Tests et Qualité

Nous accordons une grande importance à la fiabilité du système.
```bash
# Lancer les tests unitaires
npm run test

# Analyse du code (Linting)
npm run lint
```

---

## 📄 Documentation détaillée

Pour plus d'informations techniques, consultez les fiches de conception dans le dossier `MD/` :
- [Architecture & Décisions](file:///c:/Semaine%20IA/ProjectIA/Artificialntelligence/MD/ARCHITECTURE_US12.md)
- [Guide de Sécurité](file:///c:/Semaine%20IA/ProjectIA/Artificialntelligence/MD/AGENT_SAFEGUARDS.md)
- [Log des décisions](file:///c:/Semaine%20IA/ProjectIA/Artificialntelligence/MD/DECISIONS_LOG_US16.md)

---

## 🤝 Contribution

1. Forkez le projet.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`).
3. Commentez vos changements (`git commit -m 'Add some AmazingFeature'`).
4. Pushez vers la branche (`git push origin feature/AmazingFeature`).
5. Ouvrez une Pull Request.

---

## ⚖️ Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---

<div align="center">
  Développé avec ❤️ par l'équipe Artificialntelligence
</div>
