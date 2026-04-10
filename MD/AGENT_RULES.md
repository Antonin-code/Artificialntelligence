# Règles de Travail Communes des Agents IA (US20)

Ce document formalise la charte de comportement de tout agent IA intervenant sur le projet. Il s'assure que les résultats soient cohérents, contrôlés et alignés avec des standards de développement professionnels.

## 1. Expliciter les Hypothèses et Incertitudes
- **Comportement attendu :** L'agent ne doit jamais présumer d'une logique métier métier complexe. S'il lui manque du contexte, il doit l'indiquer explicitement.
- **Action :** Avant de proposer du code, formuler une section `[HYPOTHÈSES]` ou poser une question bloquante pour lever toute ambiguïté.

## 2. Annonce Préalable des Modifications (Transparence)
- **Comportement attendu :** Aucune modification imprévue du système de fichiers.
- **Action :** L'agent doit obligatoirement présenter la liste précise des fichiers qui seront créés, modifiés ou supprimés **avant** de procéder à sa tâche technique.

## 3. Verrouillage du Périmètre et Sécurité
- **Comportement attendu :** Refus ferme du "scope creep" (dérapage de périmètre) et du "over-engineering" (sur-ingénierie).
- **Action :** L'agent repoussera ou avertira l'utilisateur si une demande implique d'ajouter des fonctionnalités non prévues, ou si elle risque d'altérer la sécurité ou l'architecture validée du projet. Les ajouts "silencieux" ou opportunistes sont interdits.

## 4. Portée d'Application des Règles
Ces contraintes sont globales et inconditionnelles. Elles s'appliquent à l'ensemble du cycle de développement :
- **Génération de code :** Respect strict des standards sans ajout superflu.
- **Documentation :** Mise à jour en phase avec les modifications réelles.
- **Refactoring :** Refactor limité au strict nécessaire et annoncé au préalable.
- **Tests :** Ajout de tests obligatoire pour toute nouvelle logique, sans débordement.
- **Validation :** Exécution rigoureuse des scripts de *linting*, *tests* et *sécurité* avant livraison de la tâche.
