# Guide de la Pipeline CI/CD - StudCall

Ce document explique le fonctionnement de notre chaîne d'intégration continue (CI) automatisée via GitHub Actions.

## 🚀 Pourquoi cette pipeline ?
L'objectif est d'assurer que chaque modification de code respecte les standards de qualité du projet et ne casse pas les fonctionnalités existantes (non-régression).

## ⚡ Déclenchement
La pipeline s'exécute automatiquement lors de :
- Tout **Push** sur les branches `main`, `develop` ou `features/*`.
- Toute **Pull Request** vers les branches `main` ou `develop`.

---

## 🔍 Les étapes de vérification

La pipeline exécute les 5 étapes suivantes dans l'ordre. Si une étape échoue, la pipeline s'arrête et le commit est marqué d'une croix rouge ❌.

### 1. Installation des Dépendances
- **Action** : `npm ci`
- **Vérification** : S'assure que toutes les bibliothèques nécessaires au projet peuvent être installées sans conflit.

### 2. Contrôle de Qualité (Linting)
- **Action** : `npm run lint`
- **Vérification** : Analyse la syntaxe et le style du code (ESLint). 
  - *Exemple d'erreur bloquante* : Caractères non échappés dans le texte (`l'appel` au lieu de `l&apos;appel`), variables inutilisées, ou erreurs de structure React.

### 3. Validation Typage (Type Checking)
- **Action** : `tsc --noEmit`
- **Vérification** : Utilise le compilateur TypeScript pour détecter des incohérences de données. 
  - *Exemple d'erreur bloquante* : Passer un nombre à une fonction qui attend une chaîne de caractères, ou oublier de gérer un cas `null/undefined`.

### 4. Tests Unitaires & Intégration
- **Action** : `npm test`
- **Vérification** : Exécute tous les tests automatisés (Vitest).
  - **Tests Unitaires** : Vérifie les calculs critiques (ex: formule de Haversine pour la distance).
  - **Tests d'Intégration** : Simule un parcours utilisateur complet sur le Dashboard étudiant (succès de l'émargement, cas d'échec GPS, distance trop grande).

### 5. Vérification du Build Production
- **Action** : `npm run build`
- **Vérification** : Tente de générer l'application optimisée pour la mise en ligne.
  - *Exemple d'erreur bloquante* : Un fichier manquant ou une erreur de configuration Next.js qui empêcherait l'application de démarrer en production.

### 6. Analyse de Qualité SonarQube
- **Action** : Scan SonarQube automatisé.
- **Vérification** : Mesure la dette technique, les "Code Smells" (mauvaises pratiques), la duplication de code et les vulnérabilités de sécurité.
- **Industrialisation** : Permet de maintenir un standard de qualité élevé sur le long terme en visualisant l'évolution de la santé du code.

---

## 🛠️ Que faire en cas d'échec ?

1. **Voir l'erreur** : Cliquez sur la croix rouge ❌ dans GitHub, puis sur "Details". GitHub vous indiquera l'étape exacte qui a posé problème.
2. **Reproduire localement** : Lancez la commande correspondante sur votre ordinateur (ex: `npm run lint` ou `npm test`) pour identifier et corriger le bug.
3. **Pousser la correction** : Une fois corrigé, faites un nouveau commit et poussez. La pipeline repartira à zéro.

> [!IMPORTANT]
> **Règle d'or** : Il est interdit de fusionner (merge) une modification si la pipeline n'est pas "au vert" ✅.
