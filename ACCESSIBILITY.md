# Déclaration d'Accessibilité (a11y) - StudCall

Ce document répertorie les efforts d'accessibilité numérique mis en place dans le projet **StudCall**, afin de satisfaire les critères de la story **US25**.

## 1. Socle d'Accessibilité
L'application repose sur le socle **Radix UI** (via **Shadcn UI**) qui garantit nativement pour ses composants interactifs :
- Une navigation au clavier complète (`Tab`, `Enter`, `Space`, `Arrows`).
- Une gestion native du focus (pièges à focus dans les *Modals* et *Dialogs*).
- Des balises `aria-*` de base générées automatiquement pour les états interactifs (ex: `aria-expanded`).

## 2. Ajustements Spécifiques Ajoutés
Pour assurer une utilisation compréhensible par les lecteurs d'écran, les ajustements manuels suivants ont été implémentés sur les formulaires et les tableaux de bord :
- **Alertes dynamiques :** Ajout des balises `role="alert"` et `aria-live="assertive"` sur toutes les bulles d'erreurs (connexion, erreur de géolocalisation).
- **Invalidation :** Liaison des formulaires via `aria-invalid` pour avertir un utilisateur non-voyant de l'échec de sa saisie.
- **Régions en direct (Polite) :** Annonce des changements d'état asynchrones peu urgents avec `aria-live="polite"` (par exemple la recherche de coordonnées GPS).
- **Statuts d'attente (Busy) :** Ajout de `aria-busy` sur les boutons soumis à des requêtes serveur asynchrones.

## 3. Limites Connues
Le projet a été développé pour respecter la base de l'accessibilité requise pour une démonstration. Toutefois, des limites existent et doivent être documentées :
1. **Tests Lecteurs d'écrans :** Aucun audit approfondi sur des outils professionnels (NVDA, JAWS, VoiceOver) n'a été réalisé de bout en bout sur un panel d'utilisateurs en situation de handicap.
2. **Contrastes (WCAG AAA) :** Les couleurs Tailwind par défaut conviennent au niveau AA, mais n'ont pas fait l'objet d'une validation de contraste avancé (AAA) via l'outil Axe ou Lighthouse.
3. **Traduction / Contenus Textuels :** Les textes ont été rédigés en français sans recours systématique au "Facile À Lire et à Comprendre" (FALC).

Dans les futures évolutions, la mise en place d'un audit formel (via `eslint-plugin-jsx-a11y` combiné à LighthouseCI) est fortement recommandée.
