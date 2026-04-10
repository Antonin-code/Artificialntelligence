# Journal des Décisions (DECISIONS_LOG.md)
## Projet StudCall - Émargement Géolocalisé

Ce document répertorie les décisions structurantes prises durant le développement du projet StudCall, couvrant les aspects produit, architecture, sécurité et technique.

---

### 1. PRODUIT : Choix de la Géolocalisation vs QR Code
- **TITRE** : Priorité à la Géolocalisation native pour l'émargement.
- **DATE** : 09/04/2026
- **CONTEXTE** : Comment garantir qu'un étudiant est physiquement présent en cours sans nécessiter de matériel coûteux ou de processus administratifs lourds ?
- **OPTIONS ENVISAGÉES** :
    1. **QR Code statique ou dynamique** : Affiché par l'enseignant, scanné par l'élève.
    2. **Géolocalisation (GPS)** : Validation basée sur la proximité avec les coordonnées de l'école.
- **CHOIX RETENU & JUSTIFICATION** : **Option 2 (Géolocalisation)**. Dans un contexte d'école d'informatique, les QR codes statiques sont trop faciles à frauder (envoi d'une photo par message). La géolocalisation offre un compromis idéal : elle ne nécessite aucun matériel supplémentaire (smartphone de l'élève) et assure une présence dans un périmètre restreint (ex: 100m), rendant la fraude à distance impossible.
- **COMPROMIS & CONSÉQUENCES** : Dépendance à la qualité du signal GPS à l'intérieur des bâtiments. On accepte une marge d'erreur (rayon de 100m) pour compenser les imprécisions de géolocalisation indoor.

---

### 2. ARCHITECTURE : Calcul de distance côté Serveur (Server Actions)
- **TITRE** : Centralisation de la logique de validation de distance sur le serveur.
- **DATE** : 09/04/2026
- **CONTEXTE** : Où doit avoir lieu le calcul entre les coordonnées GPS de l'étudiant et celles de la session ?
- **OPTIONS ENVISAGÉES** :
    1. **Calcul côté Client** : Le navigateur calcule la distance et envoie uniquement "OK" ou "KO".
    2. **Calcul côté Serveur (Server Actions)** : Le client envoie ses coordonnées brutes, le serveur valide la distance.
- **CHOIX RETENU & JUSTIFICATION** : **Option 2 (Calcul Serveur)**. Pour des raisons de sécurité évidentes, le client ne doit jamais être juge de sa propre validité. En utilisant les Server Actions de Next.js, nous gardons la formule de Haversine et les coordonnées cibles (école) secrètes et inviolables. Cela empêche un utilisateur de simuler une réussite en appelant simplement une API de succès.
- **COMPROMIS & CONSÉQUENCES** : Légère augmentation de la latence due au transfert des coordonnées et au calcul serveur, mais négligeable face au gain de sécurité et d'intégrité des données.

---

### 3. SÉCURITÉ : Protection des données de localisation des étudiants
- **TITRE** : Approche "Privacy by Design" pour les données GPS.
- **DATE** : 09/04/2026
- **CONTEXTE** : La collecte de données de localisation est hautement sensible (RGPD). Comment traiter ces données de manière éthique et sécurisée ?
- **OPTIONS ENVISAGÉES** :
    1. **Stockage exhaustif** : Enregistrer les coordonnées GPS de chaque émargement en base de données pour historique.
    2. **Calcul éphémère** : Utiliser les coordonnées uniquement pour le calcul de distance sans jamais les stocker.
- **CHOIX RETENU & JUSTIFICATION** : **Option 2 (Calcul éphémère)**. Pour respecter le principe de minimisation des données du RGPD, StudCall ne stocke aucune coordonnée GPS. Le serveur reçoit la position, compare la distance, enregistre le statut "Présent", puis détruit immédiatement les coordonnées de la mémoire vive. Seule la preuve de présence est conservée.
- **COMPROMIS & CONSÉQUENCES** : Impossibilité de réaliser des analyses a posteriori sur les zones exactes d'émargement, mais protection juridique et éthique maximale pour l'établissement.

---

### 4. TECHNIQUE : Next.js 14 et Supabase pour le MVP
- **TITRE** : Adoption d'une stack Fullstack Serverless.
- **DATE** : 09/04/2026
- **CONTEXTE** : Quelle stack technique permet un développement rapide, type-safe et facile à déployer pour un jury ?
- **OPTIONS ENVISAGÉES** :
    1. **MERN (MongoDB, Express, React, Node)** : Stack traditionnelle décorrélée.
    2. **Next.js 14 (App Router) + Supabase** : Framework unifié avec Backend-as-a-Service.
- **CHOIX RETENU & JUSTIFICATION** : **Option 2 (Next.js + Supabase)**. L'App Router de Next.js 14 permet de gérer le Frontend, le Backend (API/Actions) et le SEO dans un seul repo. Supabase accélère drastiquement la gestion de l'authentification et de la base de données PostgreSQL tout en offrant une intégration parfaite avec TypeScript. C'est le choix optimal pour livrer un produit fini et robuste dans un délai court.
- **COMPROMIS & CONSÉQUENCES** : Vendor lock-in relatif avec Supabase, mais la base étant du standard PostgreSQL, une migration future vers un autre hébergeur reste possible sans refonte majeure.
