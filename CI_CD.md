# Documentation CI/CD - StudCall

Ce document détaille le fonctionnement de la pipeline d'intégration continue (CI) mise en place sur le projet via GitHub Actions.

## Flux de Travail
La pipeline s'exécute automatiquement lors de :
- Tout **Push** sur les branches `main` ou `develop`.
- Toute **Pull Request** vers les branches `main` ou `develop`.

## Étapes de Validation
La pipeline effectue les contrôles suivants dans l'ordre :

1.  **Installation (`npm ci`)** : Garantit que les dépendances sont installées de manière propre et reproductible.
2.  **Linting (`npm run lint`)** : Vérifie le respect des standards de formatage et de style de code définis (ESLint/Next.js).
3.  **Type Checking (`tsc`)** : Vérifie l'intégrité statique du code TypeScript et prévient les erreurs de typage.
4.  **Tests (`npm test`)** : Exécute l'ensemble des tests unitaires et d'intégration (Vitest). Un échec à cette étape bloque la suite.
5.  **Build (`npm run build`)** : Tente une compilation de production de l'application Next.js pour s'assurer que le projet est livrable.

## Gestion des Échecs
> [!IMPORTANT]
> Un échec à n'importe quelle étape de cette pipeline **bloque la validation** de la branche. 
> Il est interdit de merger du code sur `main` si la pipeline est "rouge".

### Comment corriger un échec ?
1.  Consultez les logs dans l'onglet **Actions** de votre dépôt GitHub.
2.  Reproduisez l'erreur localement avec les commandes correspondantes (ex: `npm test`).
3.  Corrigez le problème, commitez et pushez à nouveau pour relancer la validation.

---
*Ce système garantit l'industrialisation du projet et empêche la régression du cœur fonctionnel.*
