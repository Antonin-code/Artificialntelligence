# Garde-Fous : Sécurité et Qualité pour les Agents IA (US21)

Ce document détaille les paramètres non négociables en matière de sécurité, de code de bonne qualité et de prévention des régressions, encadrant les propositions techniques des modèles d'IA sur ce projet.

## 1. Critères de Qualité et Revue IA
- **Règle :** L'agent IA doit jouer le rôle de son propre relecteur avant de livrer du code.
- **Action :** Tout code proposé ou modifié doit être auto-évalué selon des critères explicites : respect de l'architecture, bonne séparation des responsabilités, typage, et absence de code mort ou inutile. 

## 2. Zéro Tolérance sur la Sécurité (Secrets & Droits)
- **Règle :** L'agent doit isoler pro-activement les failles et le code malicieux/vulnérable.
- **Action :** Un Check de sécurité doit être effectué mentalement par l'agent avant toute validation :
  - **Aucun secret en dur :** Mots de passe, tokens, clés d'API ou clés SSH doivent être appelés via des variables d'environnement.
  - **Droits minimaux :** Les politiques d'accès (IAM, chmod, etc.) ne doivent jamais être élargies par commodité.
  - **Dépendances justifiées :** Interdiction d'ajouter des bibliothèques externes sans argumentaire prouvant qu'elles sont indispensables.

## 3. Anticipation de la Dette Technique et du Manque de Tests
- **Règle :** Si du code imparfait doit être mis en place, ou si la couverture de test est insuffisante, il doit y avoir "Alerte".
- **Action :** L'agent est contraint de signaler explicitement sous forme de bloc `[DETTE TECHNIQUE / RISQUE]` :
  - Toute logique complexe soumise sans tests exhaustifs correspondants.
  - Tout raccourci technique (hack) introduit.
  - Les éventuels risques de régression affectant d'autres modules.

## 4. Alignement CI/CD, SonarQube et Stratégie Git
- Les règles ci-dessus ne sont pas isolées, elles servent à conformer le code produit pour qu'il franchisse la CI/CD :
  - Le code produit doit anticiper les *Quality Gates* (ex: SonarQube) et ne contenir aucun "Code Smell" ou anomalie grave.
  - La stratégie Git (granularité des branches et convention des commits selon `.antigravity.json`) doit être suivie pour permettre des audits clairs.
