# 🎓 Documentation Technique - EvalCommerce
## Projet Académique ING1 - 2025/2026

---

## 📑 Sommaire
1. [Présentation du Projet](#présentation-du-projet)
2. [Architecture Technique](#architecture-technique)
3. [Choix Technologiques](#choix-technologiques)
4. [Sécurité](#sécurité)
5. [Structure du Code](#structure-du-code)
6. [Tests et Validation](#tests-et-validation)

---

## Présentation du Projet

### Contexte
EvalCommerce est un système de gestion des ventes commerciales intégrant un système de messagerie hiérarchique. L'application permet à une entreprise de gérer la communication entre managers et commerciaux tout en suivant les performances de vente.

### Objectifs Pédagogiques
- **Développement Full-Stack** : Maîtrise du frontend (React) et backend (Node.js/Express)
- **Architecture MVC** : Séparation des responsabilités (Modèle-Vue-Contrôleur)
- **Sécurité Web** : Authentification JWT, hashage des mots de passe
- **Base de données** : Modélisation relationnelle et requêtes SQL optimisées
- **API RESTful** : Conception et documentation d'API

### Cas d'Usage Principal
Une entreprise avec plusieurs équipes commerciales (squads) :
- Les **commerciaux** enregistrent leurs ventes et reçoivent des directives
- Les **managers** suivent leur équipe et communiquent avec leurs commerciaux
- Les **administrateurs** ont une vue globale et gèrent les utilisateurs

---

## Architecture Technique

### Schéma d'Architecture

```
┌─────────────────┐
│   Client Web    │  React 18 + Vite
│  (Port 5173)    │  Interface utilisateur moderne
└────────┬────────┘
         │ HTTP/HTTPS
         │ JWT Token dans headers
         ▼
┌─────────────────┐
│   Serveur API   │  Express.js
│  (Port 3000)    │  Backend RESTful
└────────┬────────┘
         │
         │ MySQL2 (Pool)
         ▼
┌─────────────────┐
│   Base MySQL    │  Base de données relationnelle
│   (Port 3306)   │  3 tables principales
└─────────────────┘
```

### Flux d'Authentification

```
1. Utilisateur entre username/password
   ↓
2. Frontend → POST /login avec credentials
   ↓
3. Backend vérifie username dans DB
   ↓
4. Backend compare password avec bcrypt
   ↓
5. Backend génère JWT token (payload: id, username, role, squad)
   ↓
6. Frontend stocke token dans localStorage
   ↓
7. Chaque requête protégée envoie: Authorization: Bearer <token>
   ↓
8. Middleware verifyToken vérifie et décode le token
   ↓
9. Middleware requireRole vérifie le rôle
   ↓
10. Route autorisée → Traitement → Réponse JSON
```

---

## Choix Technologiques

### Backend

#### Express.js 5.1.0
**Pourquoi ?**
- Framework Node.js minimaliste et performant
- Excellente gestion du routing et middleware
- Large écosystème de packages NPM
- Architecture claire pour une API RESTful

**Alternatives considérées :**
- Fastify (plus rapide mais moins d'écosystème)
- NestJS (trop complexe pour ce projet)

#### MySQL + mysql2
**Pourquoi ?**
- Base de données relationnelle robuste
- Excellente intégrité référentielle (FOREIGN KEY)
- Requêtes SQL performantes avec jointures
- mysql2 offre les Promises et prepared statements

**Alternatives considérées :**
- PostgreSQL (overkill pour ce projet)
- MongoDB (pas adapté aux relations complexes)

#### JWT (jsonwebtoken)
**Pourquoi ?**
- Authentification stateless (pas de session serveur)
- Token auto-contenu (payload avec données utilisateur)
- Standard industriel (RFC 7519)
- Expiration automatique configurable

**Alternatives considérées :**
- Sessions Express (nécessite stockage serveur)
- OAuth2 (trop complexe pour ce cas d'usage)

#### bcryptjs
**Pourquoi ?**
- Hashage sécurisé des mots de passe
- Algorithme éprouvé contre les attaques
- Salt automatique intégré
- Pure JavaScript (pas de dépendances natives)

### Frontend

#### React 18
**Pourquoi ?**
- Framework moderne avec Hooks
- Architecture composants réutilisables
- Virtual DOM pour performances optimales
- Large communauté et documentation

**Alternatives considérées :**
- Vue.js (moins adapté pour projets complexes)
- Vanilla JS (trop verbeux pour l'UI)

#### Vite
**Pourquoi ?**
- Dev server ultra-rapide (HMR instantané)
- Build de production optimisé
- Configuration minimale
- Meilleure expérience développeur que Create React App

**Alternatives considérées :**
- Webpack (configuration complexe)
- Parcel (moins de contrôle)

---

## Sécurité

### Authentification

#### Hashage des Mots de Passe
```javascript
// À la création d'utilisateur
const hashedPassword = await bcrypt.hash(password, 10);
// 10 rounds de salt → protection contre brute-force
```

#### Vérification Sécurisée
```javascript
// À la connexion
const match = await bcrypt.compare(password, user.password);
// Comparaison constant-time → protection contre timing attacks
```

### Autorisation

#### Middleware en Cascade
```javascript
router.get('/protected',
  verifyToken,           // 1. Vérifie le JWT
  requireRole('manager'), // 2. Vérifie le rôle
  controllerFunction     // 3. Traite la requête
);
```

#### Contrôle Granulaire
- **Commercial** : Accède uniquement à ses propres ventes
- **Manager** : Accède uniquement à sa squad
- **Admin** : Accès total

### Protection contre les Injections SQL

#### Requêtes Préparées (Prepared Statements)
```javascript
// ❌ Mauvais (vulnerable à SQL injection)
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Bon (requête préparée)
const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
```

### CORS

#### Configuration Restrictive
```javascript
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
}));
// Autorise uniquement le frontend légitime
```

---

## Structure du Code

### Pattern MVC Adapté

```
Routes (Router)
   ↓ Délègue à
Controllers (Business Logic)
   ↓ Appelle
Services (Data Access Layer)
   ↓ Interroge
Database (MySQL)
```

### Exemple Concret : Envoi de Message

**1. Route** (`routes/message.js`)
```javascript
router.post('/send',
  verifyToken,
  requireRole('manager'),
  envoyerMessageController
);
```

**2. Controller** (`controllers/messageController.js`)
```javascript
const envoyerMessageController = async (req, res) => {
  // Validation des entrées
  const { idDestinataire, titre, contenu, squad } = req.body;
  
  // Appel au service
  const result = await messageService.envoyerMessage(...);
  
  // Réponse formatée
  return res.status(201).json({ ok: true, data: result });
};
```

**3. Service** (`services/messageService.js`)
```javascript
const envoyerMessage = async (idExp, idDest, titre, contenu, squad) => {
  // Logique métier : envoi individuel ou bulk squad
  if (squad) {
    // Récupérer tous les users de la squad
    const [users] = await db.execute('SELECT id FROM users WHERE squad = ?', [squad]);
    // Insertion en masse
    const values = users.map(u => [idExp, u.id, titre, contenu]);
    await db.query('INSERT INTO MESSAGE (...) VALUES ?', [values]);
  } else {
    // Insertion unique
    await db.execute('INSERT INTO MESSAGE (...) VALUES (?, ?, ?, ?)', [...]);
  }
};
```

### Validation des Données

#### Middleware de Validation (`middleware/validation.js`)
```javascript
const validateTitre = (titre) => {
  if (!titre || typeof titre !== 'string') {
    return { valid: false, error: 'Titre requis' };
  }
  if (titre.length < 3 || titre.length > 100) {
    return { valid: false, error: 'Titre entre 3 et 100 caractères' };
  }
  return { valid: true };
};
```

#### Utilisation dans le Controller
```javascript
const titleValidation = validateTitre(titre);
if (!titleValidation.valid) {
  return res.status(400).json({ ok: false, message: titleValidation.error });
}
```

### Logging Centralisé

#### Logger Custom (`config/logger.js`)
```javascript
const logger = {
  info: (msg) => console.log(`✅ [INFO] ${msg}`),
  error: (msg, err) => console.error(`❌ [ERROR] ${msg}`, err?.message),
  warn: (msg) => console.warn(`⚠️ [WARN] ${msg}`)
};
```

#### Utilisation
```javascript
logger.info(`Utilisateur ${username} connecté`);
logger.error('Erreur DB', error);
```

---

## Tests et Validation

### Tests Manuels Effectués

#### Authentification
- ✅ Connexion avec identifiants valides
- ✅ Rejet avec identifiants invalides
- ✅ Expiration du token après 1h
- ✅ Persistance du token après refresh

#### Autorisation
- ✅ Commercial ne peut pas accéder aux routes manager
- ✅ Manager ne peut pas accéder aux routes admin
- ✅ Vérification des rôles à chaque requête

#### Fonctionnalités Métier
- ✅ Envoi de message individuel
- ✅ Envoi de message à toute la squad
- ✅ Marquage message comme lu
- ✅ Enregistrement de vente
- ✅ Calcul correct des statistiques

#### Interface Utilisateur
- ✅ Navigation entre les pages
- ✅ Rafraîchissement des données
- ✅ Affichage responsive
- ✅ Messages d'erreur explicites

### Cas Limites Testés

- Token expiré → Redirection vers login
- Squad inexistante → Erreur 404
- Destinataire inexistant → Erreur 400
- Champs manquants → Erreur de validation
- Connexion DB perdue → Erreur serveur gracieuse

---

## Performance

### Optimisations Backend

#### Connection Pooling
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});
```
**Bénéfice :** Réutilisation des connexions DB, temps de réponse réduit

#### Requêtes Optimisées
```sql
-- Jointure efficace pour statistiques squad
SELECT 
  u.squad,
  COUNT(DISTINCT CASE WHEN u.role = 'user' THEN u.id END) as nombre_utilisateurs,
  COUNT(DISTINCT v.id_vente) as nombre_ventes
FROM users u
LEFT JOIN vente v ON u.id = v.id_user
WHERE u.squad IS NOT NULL
GROUP BY u.squad;
```

### Optimisations Frontend

#### Rafraîchissement Intelligent
```javascript
// Dashboard admin : auto-refresh toutes les 10s
useEffect(() => {
  loadStats();
  const interval = setInterval(loadStats, 10000);
  return () => clearInterval(interval);
}, []);
```

#### Gestion d'État Optimisée
- Utilisation de `useState` pour le state local
- Éviter les re-renders inutiles avec `useEffect` dependencies

---

## Améliorations Futures

### Court Terme
- Ajout de tests unitaires (Jest)
- Validation frontend avec bibliothèque (Yup/Zod)
- Pagination pour grandes listes
- Upload de fichiers pour les ventes

### Moyen Terme
- WebSockets pour notifications temps réel
- Export PDF des statistiques
- Système de notifications push
- Historique des modifications (audit log)

### Long Terme
- Application mobile (React Native)
- Intégration avec outils externes (CRM)
- Machine Learning pour prédictions de ventes
- Dashboard personnalisable

---

## Conclusion

Ce projet démontre la maîtrise des concepts fondamentaux du développement web moderne :
- Architecture Full-Stack complète
- Sécurité des applications web
- Gestion de base de données relationnelle
- Développement d'API RESTful
- Interface utilisateur moderne et responsive

Le code est structuré, documenté et prêt pour une présentation académique ou une évolution future.

---

**Développé dans le cadre du cursus ING1**  
**Année académique 2025-2026**
