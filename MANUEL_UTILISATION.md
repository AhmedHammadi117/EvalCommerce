# 📖 Manuel d’utilisation — EvalCommerce

## 1. Prérequis
- Node.js v16+
- MySQL v8+

## 2. Installation du backend
1. Cloner le projet :
   ```bash
   git clone <repo-url>
   cd projet web_s5
   ```
2. Installer les dépendances (via requirements.txt) :
   ```bash
   npm install
   # ou
   npm install $(cat requirements.txt)
   ```
   > Le fichier `requirements.txt` liste toutes les dépendances backend à installer.
3. Créer le fichier `.env` à la racine :
   ```env
   PORT=3000
   JWT_SECRET=secret123
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=VotreMotDePasseMySQL
   DB_NAME=siteDB
   FRONTEND_ORIGIN=http://localhost:5173
   ```
4. Créer la base de données MySQL :
Ouvrez MySQL Workbench ou votre terminal MySQL :

```sql
-- Créer la base
CREATE DATABASE siteDB;
USE siteDB;

-- Table users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  nom VARCHAR(50) NOT NULL DEFAULT ,
  prenom VARCHAR(50) NOT NULL DEFAULT ,
  date_naissance DATE DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','user') NOT NULL DEFAULT 'user',
  squad VARCHAR(50),
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
5. Lancer le serveur :
   ```bash
   npm start
   ```

## 3. Installation du frontend
1. Aller dans le dossier `client` :
   ```bash
   cd client
   npm install
   ```
2. Lancer le serveur de développement React :
   ```bash
   npm run dev
   ```
3. Accéder à l’interface sur [http://localhost:5173](http://localhost:5173)

## 4. Utilisation
- Se connecter avec un compte existant (admin, manager, commercial)
- Les rôles donnent accès à différentes fonctionnalités (voir README)
- Les ventes et messages sont accessibles selon le rôle

## 5. Conseils
- Pour la production, adapter les variables d’environnement et sécuriser le serveur
- Les mots de passe sont hashés automatiquement
- En cas de problème, consulter les logs ou la documentation technique

