# Standards de Qualité de Code et Documentation (US28)

Ce document établit le socle de lisibilité et de maintenabilité. Il a pour but de contrecarrer la dette technique souvent introduite par la précipitation ("vibe coding").

## 1. Les 4 Piliers Fondamentaux du Code
Toute implémentation doit obligatoirement être validée contre ces règles :
- **Lisibilité :** Un code doit se lire de haut en bas sans effort cognitif majeur. Le nommage explicite des variables/fonctions a la priorité sur la concision.
- **Anti-Duplication (DRY) :** Interdiction de copier-coller une logique complexe. Dès la 2ème occurence d'un modèle identique, la logique doit être abstraite.
- **Complexité Restreinte (KISS) :** Pas de logique alambiquée sans raison. Les fonctions doivent être courtes.
- **Séparation des Responsabilités (SOLID) :** Un bloc de code (composant, fonction, module) ne doit avoir qu'une seule raison de changer.

## 2. Politique Stricte sur les Commentaires
Les commentaires ne doivent jamais pallier un manque de clarté du code.
- **Totalement Interdits :** 
  - Les commentaires décoratifs qui paraphrasent le code (ex: `// incrémente x` sur `x++`).
  - Tolérer du code mort commenté (au lieu d'utiliser Git).
  - Les commentaires obsolètes ou mensongers.
- **Règle absolue :** On commente le *POURQUOI* (la règle métier sous-jacente ou la décision architecturale), jamais le *COMMENT* (le code est censé s'expliquer de lui-même).

## 3. Documentation des Zones Complexes et Non-Intuitives
- Dès lors que le code sort des sentiers battus (algorithme complexe, condition obscure imposée par un tiers, "hack" inévitable), la zone doit obligatoirement inclure un bloc de documentation utilitaire.
- Le développeur (ou l'IA) doit utiliser des tags explicites comme `// EXPLICATION-TECHNIQUE:` ou `// WARNING:` pour cartographier ces "zones à risques" de compréhension.

## 4. Respect du Standard et Exceptions
- Ce standard de qualité n'est pas optionnel. Tout nouveau code qui y déroge sera rejeté.
- **Cas d'exception :** Si, pour des raisons vitales (ex: optimisation de performance mathématique, limitation du framework embarqué), le code doit ignorer ces piliers, le motif justifiant ce non-respect doit être formellement documenté justifiant le "contournement" (ex: `// EXCEPTION (PERF):`).
