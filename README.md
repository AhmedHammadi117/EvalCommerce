# 📊 Projet Web - Système de Gestion des Messages et Ventes

## 📋 Vue d'ensemble

Ce projet est une application web permettant aux gestionnaires (managers) d'envoyer des messages à des commerciaux (users) individuellement ou par squad. Les commerciaux peuvent consulter leurs messages, les marquer comme lus, et enregistrer des ventes.

### Fonctionnalités principales
- ✅ **Authentification JWT** : Connexion sécurisée avec rôles (admin, manager, user)
- 📧 **Système de messages** : Envoi de messages individuels ou par squad
- 📝 **Gestion des ventes** : Commerciaux peuvent enregistrer leurs ventes
- 🔐 **Contrôle d'accès** : Middleware d'authentification et d'autorisation par rôle
- 💾 **Persistance** : Base de données MySQL avec structure normalisée

---

## 🏗️ Architecture

### Structure du projet
```
.
├── public/                  # Pages HTML (frontend)
│   ├── index.html          # Page de connexion
│   ├── user.html           # Page commerciaux
│   ├── manager.html        # Page gestionnaires
│   └── admin.html          # Page administrateurs
├── routes/                  # Définitions des endpoints API
│   ├── login.js            # POST /login
│   ├── message.js          # Messages (GET, POST /send, PATCH)
│   ├── vente.js            # Ventes (POST /add, GET)
│   ├── user.js             # Routes utilisateur
│   ├── manager.js          # Routes manager
│   └── admin.js            # Routes admin
├── controllers/             # Logique métier des routes
│   └── messageController.js # Orchestration des opérations messages
├── services/               # Accès à la base de données
│   └── messageService.js   # Opérations DB messages (CRUD)
├── middleware/             # Traitements transversaux
│   ├── auth.js             # Vérification JWT et rôles
│   └── validation.js       # Validation des données entrantes
├── config/                 # Configuration
│   ├── db.js              # Pool de connexion MySQL
│   └── constants.js       # Constantes et valeurs fixes
├── app.js                 # Point d'entrée Express
├── package.json           # Dépendances Node.js
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
