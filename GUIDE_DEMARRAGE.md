# 🚀 Guide de Démarrage Rapide - EvalCommerce

## Installation en 5 Minutes

### Prérequis
Assurez-vous d'avoir installé :
-  **Node.js** v16+ : [Télécharger](https://nodejs.org/)
-  **MySQL** v8+ : [Télécharger](https://dev.mysql.com/downloads/)
-  **Git** (optionnel) : [Télécharger](https://git-scm.com/)

---

## Étape 1 : Configuration de la Base de Données (2 min)

### Créer la base de données

Ouvrez MySQL Workbench ou votre terminal MySQL :

```sql
-- Créer la base
CREATE DATABASE siteDB;
USE siteDB;

-- Table users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'user') NOT NULL,
  squad VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table vente
CREATE TABLE vente (
  id_vente INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  id_produit INT NOT NULL,
  quantite INT NOT NULL,
  adresse VARCHAR(255) NOT NULL,
  date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);

-- Table MESSAGE
CREATE TABLE MESSAGE (
  idMessage INT AUTO_INCREMENT PRIMARY KEY,
  idExpediteur INT NOT NULL,
  idDestinataire INT NOT NULL,
  titre VARCHAR(100) NOT NULL,
  contenu TEXT NOT NULL,
  dateEnvoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lu BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (idExpediteur) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (idDestinataire) REFERENCES users(id) ON DELETE CASCADE
);
```



> **Note :** Les mots de passe doivent être hashés avec bcrypt. Utilisez le script fourni ou créez les utilisateurs via l'interface admin.

---

## Étape 2 : Configuration du Backend (1 min)

### Créer le fichier .env

À la racine du projet, créez un fichier `.env` :

```env
PORT=3000
JWT_SECRET=votre_secret_super_securise_ici_123
DB_HOST=localhost
DB_USER=root
DB_PASS=VotreMotDePasseMySQL
DB_NAME=siteDB
FRONTEND_ORIGIN=http://localhost:5173
```

> ⚠️ **Important** : Remplacez `DB_PASS` par votre mot de passe MySQL

### Installer les dépendances

```bash
npm install
```

**Packages installés** :
- express (serveur web)
- mysql2 (connexion MySQL)
- jsonwebtoken (authentification JWT)
- bcryptjs (hashage mot de passe)
- cors (cross-origin)
- dotenv (variables d'environnement)

---

## Étape 3 : Configuration du Frontend (1 min)

### Installer les dépendances client

```bash
cd client
npm install
cd ..
```

**Packages installés** :
- react & react-dom (framework UI)
- vite (dev server)

### Créer .env pour le client (optionnel)

Dans `client/.env` :

```env
VITE_API_URL=http://localhost:3000
```

---

## Étape 4 : Démarrage des Serveurs (1 min)

### Terminal 1 : Backend

```bash
npm start
```

**Résultat attendu** :
```
✅ [INFO] Serveur démarré sur http://localhost:3000
```

### Terminal 2 : Frontend

```bash
cd client
npm run dev
```

**Résultat attendu** :
```
VITE v5.4.21  ready in 387 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

---

## Étape 5 : Première Connexion

### Ouvrir l'application

1. Ouvrir votre navigateur
2. Aller à **http://localhost:5173**
3. Vous verrez la page de connexion

### Se connecter en tant qu'Admin

```
Username : admin
Password : admin123
```

### Se connecter en tant que Manager

```
Username : manager_a
Password : manager123
```

### Se connecter en tant que Commercial

```
Username : sara
Password : user123
```

---

## Vérification Rapide

### ✅ Backend fonctionne ?

Test API dans votre navigateur :
```
http://localhost:3000/login
```

Devrait afficher : `Cannot GET /login` (normal, c'est une route POST)

### ✅ Frontend fonctionne ?

```
http://localhost:5173
```

Devrait afficher la page de connexion

### ✅ Connexion DB fonctionne ?

Si le serveur démarre sans erreur, la connexion DB est OK

---

## 🔧 Dépannage Rapide

### Erreur : "EADDRINUSE" (Port déjà utilisé)

**Backend (port 3000)** :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Frontend (port 5173)** :
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Erreur : "Access denied for user"

Vérifiez votre `.env` :
- `DB_USER` correct ?
- `DB_PASS` correct ?
- MySQL est démarré ?

### Erreur : "Unknown database 'siteDB'"

Retournez à l'Étape 1 et créez la base :
```sql
CREATE DATABASE siteDB;
```

### Page blanche après connexion

1. Ouvrir la console (F12)
2. Vérifier les erreurs JavaScript
3. Vérifier que le backend est démarré
4. Vider le cache (Ctrl+Shift+R)

---

## 📊 Prochaines Étapes

Une fois l'application démarrée :

1. **En tant qu'Admin** :
   - Consulter le dashboard statistiques
   - Créer de nouveaux utilisateurs
   - Explorer les différentes vues

2. **En tant que Manager** :
   - Envoyer un message à un commercial
   - Consulter les statistiques de votre squad
   - Envoyer un message à toute l'équipe

3. **En tant que Commercial** :
   - Consulter vos messages
   - Marquer des messages comme lus
   - Enregistrer une vente
   - Voir votre historique

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **README.md** : Vue d'ensemble complète du projet
- **MANUEL_UTILISATION.md** : Guide utilisateur détaillé
- **DOCUMENTATION_TECHNIQUE.md** : Architecture et choix techniques

---

## 🆘 Support

**Problème persistant ?**
1. Vérifier les logs du serveur backend
2. Ouvrir la console du navigateur (F12)
3. Consulter la documentation complète
4. Vérifier que tous les prérequis sont installés

---

**Bon développement avec EvalCommerce ! 🎉**

*Temps d'installation total : ~5 minutes*
