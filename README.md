# 📊 EvalCommerce - Système de Gestion des Ventes et Messages

## 📋 Description du Projet

**EvalCommerce** est une application web complète permettant la gestion des ventes commerciales et la communication entre gestionnaires et commerciaux. Le système est organisé en trois niveaux hiérarchiques (Administrateur, Gestionnaire, Commercial) avec des fonctionnalités spécifiques pour chaque rôle.

### Objectifs
- Faciliter la communication entre gestionnaires et commerciaux via un système de messagerie
- Suivre et analyser les performances de vente par équipe (squad)
- Fournir des tableaux de bord statistiques en temps réel
- Gérer les utilisateurs et leurs permissions

---

## 🎯 Fonctionnalités Principales

### 👤 Rôle: Commercial (User)
- ✅ **Consultation des messages** : Réception et lecture des messages envoyés par les gestionnaires
- 📬 **Filtre messages** : Affichage des messages non lus par défaut, avec option pour voir l'historique complet
- ✅ **Marquage des messages** : Marquer les messages comme lus
- 💼 **Enregistrement des ventes** : Ajouter des ventes avec produit, quantité et adresse
- 📊 **Statistiques personnelles** : Visualisation de l'historique des ventes

### 👨‍💼 Rôle: Gestionnaire (Manager)
- 📤 **Envoi de messages** : Communication avec les commerciaux individuellement ou par squad
- 👥 **Gestion d'équipe** : Visualisation des performances de tous les membres de la squad
- 📈 **Statistiques d'équipe** : Suivi des ventes par commercial
- 🎯 **Messages ciblés** : Envoi de messages à un commercial spécifique ou à toute l'équipe

### 🔐 Rôle: Administrateur (Admin)
- 📊 **Dashboard complet** : Vue d'ensemble de toutes les statistiques
- 👥 **Gestion des utilisateurs** : Création, modification et suppression des comptes
- 📈 **Statistiques globales** :
  - Ventes totales et quantités vendues
  - Messages envoyés et statuts
  - Performances par squad
  - Top vendeurs
  - Produits les plus vendus
- 🔄 **Rafraîchissement automatique** : Mise à jour des statistiques toutes les 10 secondes

---

## 🏗️ Architecture Technique

### Stack Technologique

#### Backend
- **Node.js** avec **Express.js** 5.1.0
- **MySQL** via **mysql2** (connexion pool)
- **JWT** (jsonwebtoken) pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **CORS** pour la communication cross-origin
- **dotenv** pour la gestion des variables d'environnement

#### Frontend
- **React 18** avec **Vite** (dev server rapide)
- **CSS moderne** avec gradients et animations
- **Fetch API** pour les requêtes HTTP
- Architecture composants modulaire

### Structure du Projet

```
projet web_s5/
├── app.js                      # Point d'entrée Express
├── package.json                # Dépendances backend
├── .env                        # Variables d'environnement
├── config/
│   ├── db.js                  # Configuration MySQL pool
│   ├── logger.js              # Logger centralisé
│   └── constants.js           # Constantes globales
├── middleware/
│   ├── auth.js                # Authentification JWT + rôles
│   └── validation.js          # Validation des données
├── routes/
│   ├── login.js               # POST /login
│   ├── user.js                # Routes commerciaux
│   ├── manager.js             # Routes gestionnaires
│   ├── admin_new.js           # Routes administrateur
│   ├── vente.js               # Gestion des ventes
│   └── message.js             # Système de messagerie
├── controllers/
│   ├── adminController.js     # Logique admin
│   └── messageController.js   # Logique messages
├── services/
│   ├── adminService.js        # Accès DB admin
│   └── messageService.js      # Accès DB messages
└── client/                     # Application React
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx           # Point d'entrée React
        ├── App.jsx            # Composant racine
        ├── styles.css         # Styles globaux
        └── components/
            ├── Login.jsx
            ├── UserPage.jsx
            ├── UserStats.jsx
            ├── ManagerPage.jsx
            ├── ManagerStats.jsx
            ├── AdminPage.jsx
            ├── AdminStats.jsx
            └── AdminUsers.jsx
```

---

## 🗄️ Base de Données

### Structure MySQL

#### Table `users`
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'user') NOT NULL,
  squad VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `vente`
```sql
CREATE TABLE vente (
  id_vente INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  id_produit INT NOT NULL,
  quantite INT NOT NULL,
  adresse VARCHAR(255) NOT NULL,
  date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id)
);
```

#### Table `MESSAGE`
```sql
CREATE TABLE MESSAGE (
  idMessage INT AUTO_INCREMENT PRIMARY KEY,
  idExpediteur INT NOT NULL,
  idDestinataire INT NOT NULL,
  titre VARCHAR(100) NOT NULL,
  contenu TEXT NOT NULL,
  dateEnvoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lu BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (idExpediteur) REFERENCES users(id),
  FOREIGN KEY (idDestinataire) REFERENCES users(id)
);
```

### Squads Disponibles
- Squad A
- Squad B
- Squad C
- Squad D

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### Installation

#### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd "projet web_s5"
```

#### 2. Configurer la base de données
```sql
-- Créer la base de données
CREATE DATABASE siteDB;
USE siteDB;

-- Créer les tables (voir structure ci-dessus)
-- Insérer des données de test si nécessaire
```

#### 3. Configurer les variables d'environnement
Créer un fichier `.env` à la racine :
```env
PORT=3000
JWT_SECRET=secret123
DB_HOST=localhost
DB_USER=root
DB_PASS=VotreMotDePasse
DB_NAME=siteDB
FRONTEND_ORIGIN=http://localhost:5173
```

#### 4. Installer les dépendances backend
```bash
npm install
```

#### 5. Installer les dépendances frontend
```bash
cd client
npm install
cd ..
```

### Démarrage

#### Démarrer le serveur backend
```bash
npm start
```
Le serveur démarre sur **http://localhost:3000**

#### Démarrer le serveur frontend (dans un autre terminal)
```bash
cd client
npm run dev
```
Le client démarre sur **http://localhost:5173**

---

## 📖 Manuel d'Utilisation

### Connexion

1. Accéder à **http://localhost:5173**
2. Entrer vos identifiants (username et password)
3. Le système vous redirige automatiquement selon votre rôle

### Interface Commercial

#### Consultation des messages
- Les messages non lus s'affichent par défaut avec un fond bleu
- Cliquer sur **"Marquer lu"** pour archiver un message
- Utiliser le bouton **"📂 Anciens messages"** pour voir l'historique complet

#### Enregistrement d'une vente
1. Remplir le formulaire "Ajouter une vente" :
   - **ID produit** : Numéro du produit vendu
   - **Quantité** : Nombre d'unités vendues
   - **Adresse** : Adresse de livraison
2. Cliquer sur **"Ajouter"**
3. La vente apparaît immédiatement dans l'historique

### Interface Gestionnaire

#### Envoyer un message
1. Cliquer sur **"📤 Envoyer message"** sur la carte d'un commercial
2. Rédiger le titre et le contenu
3. Cliquer sur **"Envoyer"**

#### Message à toute l'équipe
1. Cliquer sur **"📢 Message à toute la squad"**
2. Le message sera envoyé à tous les commerciaux de votre équipe

#### Consulter les statistiques
- **Taille équipe** : Nombre de commerciaux dans la squad
- **Actifs cette semaine** : Commerciaux ayant réalisé des ventes récemment
- **Total ventes** : Nombre total de ventes de l'équipe

### Interface Administrateur

#### Dashboard statistiques
- **Vue automatique** : Les statistiques se rafraîchissent toutes les 10 secondes
- **KPIs globaux** : Ventes totales, quantités, messages, utilisateurs actifs
- **Statistiques par squad** : Performance de chaque équipe
- **Top vendeurs** : Classement des meilleurs commerciaux
- **Produits populaires** : Articles les plus vendus

#### Gestion des utilisateurs
1. Créer un utilisateur :
   - Cliquer sur **"Créer un utilisateur"**
   - Remplir le formulaire (username, password, role, squad)
   - Soumettre
2. Modifier un utilisateur :
   - Cliquer sur **"Modifier"** à côté de l'utilisateur
   - Modifier les champs nécessaires
   - Sauvegarder
3. Supprimer un utilisateur :
   - Cliquer sur **"Supprimer"**
   - Confirmer la suppression

---

## 🔐 Sécurité

### Authentification
- **JWT** avec expiration de 1 heure
- Tokens stockés dans `localStorage` côté client
- Vérification automatique à chaque requête protégée

### Autorisation
- Middleware `requireRole()` pour chaque endpoint
- Contrôle d'accès basé sur les rôles (RBAC)
- Les commerciaux ne peuvent voir que leurs propres données
- Les gestionnaires ne peuvent voir que leur squad
- Les administrateurs ont accès à tout

### Protection des données
- Mots de passe hashés avec **bcryptjs** (10 rounds)
- Validation des entrées utilisateur
- Protection contre les injections SQL via requêtes préparées
- CORS configuré pour autoriser uniquement le frontend

---

## 📡 API Endpoints

### Authentification
- `POST /login` - Connexion utilisateur

### Messages
- `GET /api/message/` - Récupérer les messages reçus (user)
- `POST /api/message/send` - Envoyer un message (manager)
- `PATCH /api/message/:id/lu` - Marquer comme lu (user)

### Ventes
- `GET /vente` - Historique des ventes (user)
- `POST /vente/add` - Ajouter une vente (user)

### Gestionnaire
- `GET /manager/stats` - Statistiques de la squad

### Administrateur
- `GET /admin/users` - Liste des utilisateurs
- `POST /admin/users` - Créer un utilisateur
- `PUT /admin/users/:id` - Modifier un utilisateur
- `DELETE /admin/users/:id` - Supprimer un utilisateur
- `GET /admin/stats` - Dashboard complet

---

## 🎨 Interface Utilisateur

### Design
- Interface moderne avec **gradients colorés**
- **Animations fluides** pour les transitions
- **Icônes emoji** pour une meilleure lisibilité
- **Design responsive** adapté aux écrans de toutes tailles

### Code Couleur
- **Bleu** (#2563eb) : Messages non lus, actions principales
- **Vert** (#10b981) : Succès, ventes, confirmations
- **Orange** (#f59e0b) : Avertissements, badges
- **Rouge** (#ef4444) : Erreurs, suppressions
- **Violet** (#8b5cf6) : Squad C, éléments spéciaux

---

## 🛠️ Développement

### Scripts disponibles

#### Backend
```bash
npm start          # Démarrer avec nodemon (reload automatique)
npm test           # Lancer les tests
```

#### Frontend
```bash
npm run dev        # Démarrer le dev server Vite
npm run build      # Build de production
npm run preview    # Prévisualiser le build
```

### Variables d'environnement Frontend
Créer `client/.env` :
```env
VITE_API_URL=http://localhost:3000
```

---

## 📝 Notes Techniques

### Gestion des erreurs
- Tous les controllers utilisent des blocs try/catch
- Logs centralisés via `logger.js`
- Messages d'erreur standardisés

### Performance
- **Connection pooling** MySQL pour optimiser les connexions
- **Rafraîchissement intelligent** des statistiques côté client
- **Requêtes SQL optimisées** avec jointures et agrégations

### Bonnes pratiques
- Architecture MVC (Modèle-Vue-Contrôleur)
- Séparation des responsabilités (routes, controllers, services)
- Code modulaire et réutilisable
- Validation des données à tous les niveaux
- Commentaires explicatifs dans le code

---

## 👥 Auteurs

Projet académique - ING1  
Année 2025-2026

---

## 📄 Licence

Ce projet est développé dans un cadre académique.
├── .env                   # Variables d'environnement (NE PAS commiter)
└── .gitignore            # Fichiers à exclure de Git
```

### Pattern MVC + Services
- **Routes** : Définissent les endpoints et le routage
- **Controllers** : Valident les entrées et orchestrent les appels au service
- **Services** : Exécutent les opérations DB et la logique métier
- **Middleware** : Sécurité (JWT), validation, CORS

---

## 🗄️ Base de données

### Tables principales

#### `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'user') DEFAULT 'user',
  squad VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `MESSAGE`
```sql

## 🔌 Intégration Backend ↔ Frontend
- Backend écoute par défaut sur `http://localhost:3000` (configurable via `.env` `PORT`).
- Frontend dev (Vite) tourne par défaut sur `http://localhost:5173` et doit définir `VITE_API_URL` pour pointer vers le backend en dev.
- Flow d'authentification : `POST /login` → réponse `{ ok, token, user }` → stocker `token` dans `localStorage` → envoyer `Authorization: Bearer <token>` sur les routes protégées.

## Démarrage local (rapide)
1) Installer dépendances backend et lancer le serveur :

```powershell
npm install
npm start
```

2) Lancer le client React (dossier `client`) :

```powershell
cd client
npm install
npm run dev
```

3) Variables importantes (fichier `.env` à la racine du backend):
- `PORT` (ex: 3000)
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` (MySQL)
- `JWT_SECRET`

## Archivage
Les fichiers legacy ont été déplacés vers `ARCHIVE_SUGGESTIONS.md` et/ou `archiver/` ; vérifier avant le push final.
CREATE TABLE MESSAGE (
  idMessage INT PRIMARY KEY AUTO_INCREMENT,
  idExpediteur INT NOT NULL,
  idDestinataire INT NOT NULL,
  titre VARCHAR(100) NOT NULL,
  contenu TEXT NOT NULL,
  dateEnvoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lu BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (idExpediteur) REFERENCES users(id),
  FOREIGN KEY (idDestinataire) REFERENCES users(id)
);
```

#### `vente`
```sql
CREATE TABLE vente (
  id_vente INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  id_produit INT NOT NULL,
  quantite INT NOT NULL,
  adresse VARCHAR(255),
  date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id)
);
```

---

## 🚀 Démarrage

### Prérequis
- Node.js >= 14
- MySQL >= 5.7
- npm ou yarn

### Installation

1. **Cloner le projet et installer les dépendances**
```bash
cd "projet web_s5"
npm install
```

2. **Configurer l'environnement** (créer `.env`)
```env
PORT=3000
JWT_SECRET=secret123
DB_HOST=localhost
DB_USER=root
DB_PASS=Henda?@2006
DB_NAME=siteDB
JWT_EXPIRES_IN=1h
```

3. **Créer la base de données et les tables**
```sql
CREATE DATABASE siteDB;
USE siteDB;

-- Copier les CREATE TABLE d'en haut
```

4. **Seed les utilisateurs de test**
```bash
node ajouter.js
```
Cela insère des utilisateurs de test :
- admin / 1234 (role: admin)
- manager / abcd (role: manager, squad: B)
- user / 0000 (role: user, squad: B)
- ahmed / 3007 (role: manager, squad: A)
- sara, paul, lisa (role: user, squad: A)

5. **Démarrer le serveur**
```bash
npm start
```
Le serveur démarre sur `http://localhost:3000`


### Frontend (React)

Un client React léger a été ajouté dans le dossier `client/` (Vite). Pour le développement :

```powershell
cd client
npm install
npm run dev
```

Pendant le développement, le backend doit autoriser l'origine `http://localhost:5173` (configurable avec `FRONTEND_ORIGIN` dans `.env`).

---

## 📡 API Endpoints

### 🔐 Authentification

#### `POST /login`
Authentifie un utilisateur et retourne un JWT.

**Requête:**
```json
{
  "username": "manager",
  "password": "abcd"
}
```

**Réponse (200 OK):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGc...",
  "user": {
    "id": 2,
    "username": "manager",
    "role": "manager"
  }
}
```

**Erreurs:**
- `400` : Champs manquants
- `401` : Username ou password invalide
- `500` : Erreur serveur

---

### 📧 Messages

#### `POST /api/message/send`
Envoie un message à un utilisateur ou une squad.

**Authentification:** Bearer token (role: manager)

**Requête (utilisateur unique):**
```json
{
  "idDestinataire": 3,
  "titre": "Rapport de vente",
  "contenu": "Voici le rapport de vente du mois..."
}
```

**Requête (squad):**
```json
{
  "squad": "A",
  "titre": "Annonce importante",
  "contenu": "Message adressé à toute la squad A"
}
```

**Réponse (201 Created):**
```json
{
  "ok": true,
  "message": "Message envoyé avec succès",
  "data": { "insertId": 5 }
}
```

**Erreurs:**
- `400` : Champs manquants, titre/contenu invalides
- `401` : Token invalide
- `403` : Accès refusé (role != manager)
- `404` : Destinataire/squad non trouvé

---

#### `GET /api/message/`
Récupère tous les messages reçus par l'utilisateur.

**Authentification:** Bearer token (role: user)

**Réponse (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "idMessage": 1,
      "titre": "Important",
      "contenu": "...",
      "dateEnvoi": "2025-12-10T15:30:00.000Z",
      "lu": false,
      "idExpediteur": 2
    }
  ]
}
```

---

#### `PATCH /api/message/:idMessage/lu`
Marque un message comme lu.

**Authentification:** Bearer token (role: user)

**Réponse (200 OK):**
```json
{
  "ok": true,
  "message": "Message marqué comme lu"
}
```

**Erreurs:**
- `404` : Message non trouvé ou accès refusé
- `401` : Token invalide

---

### 💰 Ventes

#### `POST /vente/add`
Enregistre une nouvelle vente.

**Authentification:** Bearer token (role: user)

**Requête:**
```json
{
  "id_produit": 101,
  "quantite": 5,
  "adresse": "Rue de Paris, 75000 Paris"
}
```

**Réponse (201 Created):**
```json
{
  "message": "Vente ajoutée avec succès.",
  "id_vente": 1,
  "historique": [
    {
      "id_vente": 1,
      "id_produit": 101,
      "quantite": 5,
      "adresse": "Rue de Paris, 75000 Paris",
      "date_vente": "2025-12-10T15:30:00.000Z"
    }
  ]
}
```

---

## 🔒 Sécurité

### Authentification JWT
- Les tokens sont signés avec `JWT_SECRET` et expirent après 1h
- Chaque requête protégée doit inclure l'en-tête `Authorization: Bearer <token>`

### Autorisation par rôle
- **Admin** : Accès complet
- **Manager** : Peut envoyer des messages
- **User** : Peut recevoir des messages et enregistrer des ventes

### Validation des données
- Les titres et contenus sont validés en longueur
- Les IDs utilisateurs sont validés
- Les squads sont vérifiées contre une whitelist

---

## 🧪 Tests manuels

### Scénario 1 : Envoyer un message à un utilisateur

1. **Se connecter en tant que manager**
   ```
   user: manager / mdp: abcd
   ```

2. **Envoyer un message** (aller sur manager.html)
   - ID commercial: 3
   - Titre: Test
   - Contenu: Ceci est un test
   - Cliquer "Envoyer"

3. **Recevoir le message** (se connecter avec user / 0000)
   - Aller sur user.html
   - Le message doit apparaître dans "Mes messages"
   - Cliquer "Marquer lu"

4. **Vérifier dans la DB**
   ```sql
   SELECT * FROM MESSAGE WHERE idDestinataire = 3;
   ```

### Scénario 2 : Envoyer un message à une squad

1. **Se connecter en tant que manager** (ahmed / 3007)

2. **Envoyer un message à la squad**
   - Cocher "Envoyer à toute la squad"
   - Squad: A
   - Titre / Contenu: ...
   - Cliquer "Envoyer"

3. **Vérifier** : Tous les utilisateurs de la squad A reçoivent le message

---

## 📊 Logs de développement

Le serveur log les opérations importantes avec emoji pour une meilleure lisibilité :
```
📤 [envoyerMessage] Appelé par user: 2 | Destinataire: 3
✅ [envoyerMessage] Message inséré avec succès
🔔 [marquerLu] Message 1 marqué comme lu par user 3
❌ [marquerLu] Erreur: Message introuvable
```

---

## 📝 Points clés du code

### Validation centralisée (`middleware/validation.js`)
Les entrées sont validées avant d'être traitées pour éviter des erreurs DB et des injections SQL.

### Gestion d'erreurs structurée
Tous les endpoints retournent un JSON structuré :
```json
{ "ok": true/false, "message": "...", "data": {...} }
```

### Constantes centralisées (`config/constants.js`)
Rôles, squads, messages d'erreur, limites de longueur : tout en un seul fichier.

### Middleware d'authentification (`middleware/auth.js`)
- `verifyToken` : Valide le JWT
- `requireRole(role)` : Vérifie le rôle de l'utilisateur

---

## 🎓 Intégration scolaire

Ce projet démontre :
- ✅ Architecture MVC avec services
- ✅ Sécurité : JWT + contrôle d'accès par rôle
- ✅ Validation des données
- ✅ Gestion d'erreurs structurée
- ✅ Documentation du code
- ✅ API RESTful
- ✅ Base de données normalisée

---

## 📄 Licence

Projet étudiant - Année scolaire 2025

---

## 💡 Améliorations futures

- [ ] Pagination des messages
- [ ] Archivage des messages
- [ ] Notifications en temps réel (WebSocket)
- [ ] Tests unitaires (Jest)
- [ ] Swagger/OpenAPI
- [ ] Rate limiting sur les endpoints
- [ ] Audit trail (qui a lu quand, etc.)
