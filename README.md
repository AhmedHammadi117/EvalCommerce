# EvalCommerce

Projet académique ING1 — Gestion des ventes et messagerie hiérarchique

##  Objectifs du projet
- Développer une application web complète (React + Node.js/Express)
- Gérer des utilisateurs avec rôles (admin, manager, commercial)
- Permettre la gestion des ventes et la communication interne (messagerie)
- Sécuriser l’accès (authentification JWT, validation, hashage des mots de passe)

##  Fonctionnalités principales
- Authentification sécurisée (JWT)
- Gestion des utilisateurs (CRUD, rôles, squads)
- Saisie et historique des ventes par les commerciaux
- Statistiques pour managers et administrateurs
- Messagerie interne (managers → commerciaux)
- Interface moderne (React, Vite)

##  Architecture
- **Backend** : Node.js, Express, MySQL, JWT, bcryptjs
- **Frontend** : React 18, Vite
- **Base de données** : MySQL (tables users, vente, MESSAGE)

##  Structure du projet

```
projet web_s5/
│
├── app.js                # Point d'entrée backend (Express)
├── package.json          # Dépendances backend
├── requirements.txt      # Liste des dépendances à installer
├── .env                  # Variables d'environnement (à créer)
│
├── config/               # Configuration (DB, logger, constantes)
│   ├── constants.js
│   ├── db.js
│   └── logger.js
│
├── controllers/          # Logique métier (admin, message)
│   ├── adminController.js
│   └── messageController.js
│
├── middleware/           # Middlewares Express (auth, validation)
│   ├── auth.js
│   └── validation.js
│
├── routes/               # Définition des routes API
│   ├── admin_new.js
│   ├── login.js
│   ├── manager.js
│   ├── message.js
│   ├── user.js
│   └── vente.js
│
├── services/             # Services (accès DB, logique)
│   ├── adminService.js
│   └── messageService.js
│
└── client/               # Frontend React (Vite)
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── styles.css
        └── components/
            ├── AdminPage.jsx
            ├── AdminStats.jsx
            ├── AdminUsers.jsx
            ├── Dashboard.jsx
            ├── Login.jsx
            ├── ManagerPage.jsx
            ├── ManagerStats.jsx
            ├── UserPage.jsx
            └── UserStats.jsx
```

##  Sécurité
- Authentification par JWT
- Validation des entrées côté backend
- Hashage des mots de passe (bcrypt)

##  Rôles & droits
- **Admin** : gestion utilisateurs, stats globales
- **Manager** : stats équipe, envoi de messages
- **Commercial** : saisie ventes, lecture messages

##  Démarrage rapide
1. Installer les dépendances backend :
   ```bash
   npm install
   # ou
   npm install $(cat requirements.txt)
   ```
2. Installer les dépendances frontend :
   ```bash
   cd client
   npm install
   ```
3. Configurer la base de données et le fichier `.env` (voir MANUEL_UTILISATION.md)
4. Lancer le backend :
   ```bash
   npm start
   ```
5. Lancer le frontend :
   ```bash
   cd client
   npm run dev
   ```

##  Potentiel d'évolution et usages avancés
Ce projet, bien qu'initialement académique, a été conçu pour être facilement extensible et adaptable aux besoins réels d'une entreprise :
- Possibilité d'intégrer des modules d'analyse de données pour suivre la performance des employés et des ventes.
- Export des données pour des outils de visualisation avancée (Power BI, Tableau, etc.) afin de produire des rapports graphiques et des dashboards personnalisés.
- Adaptation possible à tout secteur d'activité : la structure peut évoluer selon les besoins métiers (ajout de KPIs, de modules RH, de reporting, etc.).
- Le backend et la base de données sont prêts pour accueillir des extensions (API REST, endpoints analytiques, etc.).

> Ce projet peut donc servir de socle pour un outil professionnel de suivi, d'analyse et de pilotage d'activité commerciale, avec des perspectives d'évolution vers la data science et la business intelligence.

##  Auteurs
- Projet BE académique ING1 S5 — 2025/2026

