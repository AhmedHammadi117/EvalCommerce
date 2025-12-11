# 📡 Documentation complète des APIs

Ce document explique **tous les endpoints** de l'application avec détails, exemples et codes d'erreur.

## 📚 Table des matières

1. [Authentification](#authentification)
2. [Messages](#messages)
3. [Ventes](#ventes)
4. [Routes utilisateurs](#routes-utilisateurs)
5. [Codes d'erreur](#codes-derreur)
6. [Exemples complets](#exemples-complets)

---

## 🔐 Authentification

### `POST /login`

**Description:** Authentifie un utilisateur et retourne un JWT pour accéder aux routes protégées.

**URL:** `http://localhost:3000/login`

**Méthode:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Corps de la requête (Body):**
```json
{
  "username": "manager",
  "password": "abcd"
}
```

**Paramètres:**
| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `username` | string | ✅ | Nom d'utilisateur |
| `password` | string | ✅ | Mot de passe en clair |

**Réponse en cas de succès (200 OK):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "manager",
    "role": "manager"
  }
}
```

**Réponse en cas d'erreur (401 Unauthorized):**
```json
{
  "message": "username invalide"
}
```

**Codes d'erreur possibles:**
| Code | Message | Cause |
|------|---------|-------|
| `400` | "deux champs manque" | `username` ou `password` manquant |
| `401` | "username invalide" | L'utilisateur n'existe pas |
| `401` | "password invalide" | Le mot de passe est incorrect |
| `500` | "Erreur serveur" | Erreur base de données |

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager","password":"abcd"}'
```

**Explications:**
1. L'utilisateur envoie son nom d'utilisateur et son mot de passe
2. Le serveur vérifie si l'utilisateur existe en base de données
3. Si l'utilisateur existe, le serveur compare le mot de passe haché
4. Si le mot de passe est correct, un **JWT token** est généré
5. Le token est valide **1 heure** (`JWT_EXPIRES_IN=1h`)
6. Ce token doit être envoyé dans l'en-tête `Authorization` pour accéder aux routes protégées

**Rôles et squads:**
```
admin   / 1234     → role: admin    (admin)
manager / abcd     → role: manager  (squad: B)
user    / 0000     → role: user     (squad: B)
ahmed   / 3007     → role: manager  (squad: A)
sara    / 2006     → role: user     (squad: A)
paul    / 4008     → role: user     (squad: A)
lisa    / 5009     → role: user     (squad: A)
```

**Important:**
- Le token doit être stocké dans `localStorage` côté frontend (voir `public/index.html`)
- Le token est utilisé pour **authentifier les requêtes suivantes**
- Les erreurs 401/403 signifient que le token est invalide ou expiré

---

## 📧 Messages

### `POST /api/message/send`

**Description:** Envoie un message à un utilisateur spécifique OU à toute une squad.

**URL:** `http://localhost:3000/api/message/send`

**Méthode:** `POST`

**Authentification:** ✅ **Requise** (Bearer token)

**Rôle requis:** `manager` (seuls les gestionnaires peuvent envoyer)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### **Cas 1: Envoyer à un utilisateur unique**

**Corps de la requête:**
```json
{
  "idDestinataire": 3,
  "titre": "Rapport mensuel",
  "contenu": "Voici le rapport de vente du mois de décembre..."
}
```

**Paramètres:**
| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `idDestinataire` | number | ✅* | ID du commerciaux destinataire |
| `titre` | string | ✅ | Titre du message (3-100 caractères) |
| `contenu` | string | ✅ | Contenu du message (5-5000 caractères) |
| `squad` | string | ❌ | Optionnel, voir cas 2 |

*Obligatoire si `squad` n'est pas fourni

**Réponse en cas de succès (201 Created):**
```json
{
  "ok": true,
  "message": "Message envoyé avec succès",
  "data": {
    "insertId": 5,
    "affectedRows": 1
  }
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "idDestinataire": 3,
    "titre": "Test",
    "contenu": "Ceci est un message de test"
  }'
```

---

#### **Cas 2: Envoyer à une squad complète (Broadcast)**

**Description:** Envoie le même message à **tous les utilisateurs** d'une squad spécifique.

**Corps de la requête:**
```json
{
  "squad": "A",
  "titre": "Annonce importante",
  "contenu": "Tous les membres de la squad A doivent lire ce message urgent."
}
```

**Paramètres:**
| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `squad` | string | ✅* | Nom de la squad (A, B, C, D) |
| `titre` | string | ✅ | Titre du message |
| `contenu` | string | ✅ | Contenu du message |
| `idDestinataire` | number | ❌ | Ignoré si `squad` est fourni |

*Obligatoire si `idDestinataire` n'est pas fourni

**Réponse en cas de succès (201 Created):**
```json
{
  "ok": true,
  "message": "Message envoyé à la squad A",
  "data": {
    "insertedCount": 3
  }
}
```

**Explications:**
- Tous les utilisateurs avec `squad = 'A'` et `role = 'user'` reçoivent le message
- Dans cet exemple, **3 messages** ont été créés (3 utilisateurs dans la squad A)
- Chaque utilisateur peut marquer **son message** comme lu indépendamment

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "squad": "A",
    "titre": "Annonce",
    "contenu": "Message pour la squad A"
  }'
```

**Codes d'erreur:**

| Code | Message | Cause |
|------|---------|-------|
| `400` | "Id destinataire ou squad requis" | Ni `idDestinataire` ni `squad` fourni |
| `400` | "Titre trop court" | Titre < 3 caractères |
| `400` | "Titre trop long" | Titre > 100 caractères |
| `400` | "Contenu trop court" | Contenu < 5 caractères |
| `400` | "Contenu trop long" | Contenu > 5000 caractères |
| `400` | "Squad invalide" | Squad pas dans [A, B, C, D] |
| `401` | "Token invalide ou expiré" | JWT expiré ou manquant |
| `403` | "Accès refusé" | Rôle != manager |
| `404` | "Destinataire introuvable" | L'ID utilisateur n'existe pas |
| `404` | "Aucun destinataire pour cette squad" | Aucun user dans la squad |
| `500` | "Erreur serveur" | Erreur base de données |

---

### `GET /api/message/`

**Description:** Récupère tous les messages reçus par l'utilisateur authentifié.

**URL:** `http://localhost:3000/api/message/`

**Méthode:** `GET`

**Authentification:** ✅ **Requise**

**Rôle requis:** `user` (seuls les commerciaux/users peuvent recevoir des messages)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paramètres:** Aucun

**Réponse en cas de succès (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "idMessage": 1,
      "titre": "Rapport mensuel",
      "contenu": "Voici le rapport de vente...",
      "dateEnvoi": "2025-12-10T15:30:00.000Z",
      "lu": false,
      "idExpediteur": 2
    },
    {
      "idMessage": 2,
      "titre": "Urgent",
      "contenu": "À traiter en priorité",
      "dateEnvoi": "2025-12-10T14:20:00.000Z",
      "lu": true,
      "idExpediteur": 2
    }
  ]
}
```

**Explication des champs:**
| Champ | Type | Description |
|-------|------|-------------|
| `idMessage` | number | ID unique du message en BD |
| `titre` | string | Titre du message |
| `contenu` | string | Contenu du message |
| `dateEnvoi` | ISO 8601 | Date/heure d'envoi (format UTC) |
| `lu` | boolean | `true` si message marqué comme lu, `false` sinon |
| `idExpediteur` | number | ID du manager qui a envoyé |

**Si aucun message:**
```json
{
  "ok": true,
  "data": []
}
```

**Exemple cURL:**
```bash
curl -X GET http://localhost:3000/api/message/ \
  -H "Authorization: Bearer eyJhbGc..."
```

**Codes d'erreur:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | "Aucun token fourni" | Header `Authorization` manquant |
| `401` | "Token invalide ou expiré" | JWT expiré/signé incorrectement |
| `403` | "Accès refusé" | Rôle != user |
| `500` | "Erreur serveur" | Erreur base de données |

**Les messages sont triés par date décroissante** (les plus récents en premier).

---

### `PATCH /api/message/:idMessage/lu`

**Description:** Marque un message comme **lu** (lecture confirmée).

**URL:** `http://localhost:3000/api/message/5/lu` (où 5 est l'ID du message)

**Méthode:** `PATCH`

**Authentification:** ✅ **Requise**

**Rôle requis:** `user`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paramètres d'URL:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `idMessage` | number | ID du message à marquer comme lu |

**Corps de la requête:** Vide (pas de body)

**Réponse en cas de succès (200 OK):**
```json
{
  "ok": true,
  "message": "Message marqué comme lu"
}
```

**Exemple cURL:**
```bash
curl -X PATCH http://localhost:3000/api/message/5/lu \
  -H "Authorization: Bearer eyJhbGc..."
```

**Sécurité:**
- L'utilisateur ne peut marquer que **ses propres messages** comme lus
- La vérification se fait avec `idDestinataire == idUser` en base de données
- Si l'utilisateur essaie de marquer un message reçu par quelqu'un d'autre → erreur 404

**Codes d'erreur:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | "Aucun token fourni" | Pas d'authentification |
| `401` | "Token invalide ou expiré" | JWT invalide |
| `403` | "Accès refusé" | Rôle != user |
| `404` | "Message introuvable ou accès refusé" | Le message n'existe pas OU appartient à quelqu'un d'autre |
| `500` | "Erreur serveur" | Erreur base de données |

**Explication de la sécurité:**
```javascript
// La requête SQL vérifie:
// 1. Le message existe
// 2. Il appartient à l'utilisateur authentifié
UPDATE MESSAGE SET lu = TRUE 
WHERE idMessage = 5 
AND idDestinataire = 3;  // idDestinataire doit correspondre à l'utilisateur
```

---

## 💰 Ventes

### `POST /vente/add`

**Description:** Enregistre une nouvelle vente pour l'utilisateur authentifié et retourne son historique complet.

**URL:** `http://localhost:3000/vente/add`

**Méthode:** `POST`

**Authentification:** ✅ **Requise**

**Rôle requis:** `user` (seuls les commerciaux peuvent enregistrer des ventes)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Corps de la requête:**
```json
{
  "id_produit": 101,
  "quantite": 5,
  "adresse": "Rue de la Paix, 75000 Paris"
}
```

**Paramètres:**
| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `id_produit` | number | ✅ | ID du produit vendu |
| `quantite` | number | ✅ | Quantité vendue (doit être > 0) |
| `adresse` | string | ✅ | Adresse de la vente |

**Réponse en cas de succès (201 Created):**
```json
{
  "message": "Vente ajoutée avec succès.",
  "id_vente": 15,
  "historique": [
    {
      "id_vente": 15,
      "id_produit": 101,
      "quantite": 5,
      "adresse": "Rue de la Paix, 75000 Paris",
      "date_vente": "2025-12-10T16:45:00.000Z"
    },
    {
      "id_vente": 14,
      "id_produit": 102,
      "quantite": 3,
      "adresse": "Rue de la Liberté, 75001 Paris",
      "date_vente": "2025-12-10T15:30:00.000Z"
    }
  ]
}
```

**Explications:**
- `id_vente` : ID unique de la vente créée
- `historique` : Liste complète des ventes de l'utilisateur (ancien + nouveau)
- Les ventes sont triées par date décroissante

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/vente/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "id_produit": 101,
    "quantite": 5,
    "adresse": "Rue de Paris, 75000 Paris"
  }'
```

**Codes d'erreur:**

| Code | Message | Cause |
|------|---------|-------|
| `400` | "Champs manquants" | L'un des 3 paramètres manque |
| `401` | "Aucun token fourni" | Pas d'authentification |
| `401` | "Token invalide ou expiré" | JWT invalide |
| `403` | "Accès refusé" | Rôle != user |
| `500` | "Erreur interne serveur" | Erreur base de données |

---

### `GET /vente`

**Description:** Récupère l'historique des ventes de l'utilisateur authentifié.

**URL:** `http://localhost:3000/vente`

**Méthode:** `GET`

**Authentification:** ✅ **Requise**

**Rôle requis:** `user`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paramètres:** Aucun

**Réponse en cas de succès (200 OK):**
```json
{
  "ventes": [
    {
      "id_vente": 15,
      "id_produit": 101,
      "quantite": 5,
      "adresse": "Rue de la Paix, 75000 Paris",
      "date_vente": "2025-12-10T16:45:00.000Z"
    },
    {
      "id_vente": 14,
      "id_produit": 102,
      "quantite": 3,
      "adresse": "Rue de la Liberté, 75001 Paris",
      "date_vente": "2025-12-10T15:30:00.000Z"
    }
  ]
}
```

**Si aucune vente:**
```json
{
  "ventes": []
}
```

**Exemple cURL:**
```bash
curl -X GET http://localhost:3000/vente \
  -H "Authorization: Bearer eyJhbGc..."
```

**Codes d'erreur:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | "Aucun token fourni" | Pas d'authentification |
| `401` | "Token invalide ou expiré" | JWT invalide |
| `403` | "Accès refusé" | Rôle != user |
| `500` | "Erreur serveur" | Erreur base de données |

---

## 👥 Routes utilisateurs

### `GET /user`

**Description:** Route de test pour vérifier que l'utilisateur est connecté avec le rôle `user`.

**URL:** `http://localhost:3000/user`

**Méthode:** `GET`

**Authentification:** ✅ **Requise**

**Rôle requis:** `user`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse en cas de succès (200 OK):**
```json
{
  "message": "Bienvenue Utilisateur sara"
}
```

**Codes d'erreur:**

| Code | Message | Cause |
|------|---------|-------|
| `401` | "Aucun token fourni" | Pas d'authentification |
| `401` | "Token invalide ou expiré" | JWT invalide |
| `403` | "Accès refusé" | Rôle != user |

---

### `GET /manager`

**Description:** Route de test pour vérifier que l'utilisateur est connecté avec le rôle `manager`.

**URL:** `http://localhost:3000/manager`

**Méthode:** `GET`

**Authentification:** ✅ **Requise**

**Rôle requis:** `manager`

**Réponse en cas de succès (200 OK):**
```json
{
  "message": "Bienvenue Manager ahmed"
}
```

---

### `GET /admin`

**Description:** Route de test pour vérifier que l'utilisateur est connecté avec le rôle `admin`.

**URL:** `http://localhost:3000/admin`

**Méthode:** `GET`

**Authentification:** ✅ **Requise**

**Rôle requis:** `admin`

**Réponse en cas de succès (200 OK):**
```json
{
  "message": "Bienvenue admin admin"
}
```

---

## 📋 Codes d'erreur

### Codes HTTP standard

| Code | Signification | Explication |
|------|---------------|-------------|
| `200` | OK | Requête réussie |
| `201` | Created | Ressource créée avec succès |
| `400` | Bad Request | Données invalides ou manquantes |
| `401` | Unauthorized | Authentification échouée ou token invalide |
| `403` | Forbidden | Authentification réussie mais accès refusé (rôle insuffisant) |
| `404` | Not Found | Ressource non trouvée |
| `500` | Internal Server Error | Erreur serveur (base de données, etc.) |

### Format standard des erreurs

Tous les endpoints retournent une réponse structurée:

**En cas de succès:**
```json
{
  "ok": true,
  "message": "Description de l'opération",
  "data": { /* données supplémentaires */ }
}
```

**En cas d'erreur:**
```json
{
  "ok": false,
  "message": "Description de l'erreur"
}
```

---

## 🧪 Exemples complets

### Scénario complet: Manager envoie un message à un user

**Étape 1: Manager se connecte**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ahmed","password":"3007"}'
```

Réponse:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJhaG1lZCIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzY2NTI5NzAwLCJleHAiOjE3NjY1MzMzMDB9.xxx",
  "user": {
    "id": 5,
    "username": "ahmed",
    "role": "manager"
  }
}
```

**Étape 2: Manager envoie un message à sara (ID=4)**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "idDestinataire": 4,
    "titre": "Votre objectif de vente",
    "contenu": "Sara, tu dois atteindre 100 ventes ce mois-ci. C'\''est important!"
  }'
```

Réponse:
```json
{
  "ok": true,
  "message": "Message envoyé avec succès",
  "data": {
    "insertId": 10
  }
}
```

**Étape 3: Sara se connecte et récupère ses messages**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sara","password":"2006"}'
```

Réponse (on récupère le token):
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJzYXJhIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjY1Mjk3MzAsImV4cCI6MTc2NjUzMzMzMH0.yyy",
  "user": {
    "id": 4,
    "username": "sara",
    "role": "user"
  }
}
```

**Étape 4: Sara récupère ses messages**
```bash
TOKEN_SARA="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/api/message/ \
  -H "Authorization: Bearer $TOKEN_SARA"
```

Réponse:
```json
{
  "ok": true,
  "data": [
    {
      "idMessage": 10,
      "titre": "Votre objectif de vente",
      "contenu": "Sara, tu dois atteindre 100 ventes ce mois-ci...",
      "dateEnvoi": "2025-12-10T17:00:00.000Z",
      "lu": false,
      "idExpediteur": 5
    }
  ]
}
```

**Étape 5: Sara marque le message comme lu**
```bash
curl -X PATCH http://localhost:3000/api/message/10/lu \
  -H "Authorization: Bearer $TOKEN_SARA"
```

Réponse:
```json
{
  "ok": true,
  "message": "Message marqué comme lu"
}
```

**Étape 6: Sara vérifie à nouveau ses messages**
```bash
curl -X GET http://localhost:3000/api/message/ \
  -H "Authorization: Bearer $TOKEN_SARA"
```

Réponse:
```json
{
  "ok": true,
  "data": [
    {
      "idMessage": 10,
      "titre": "Votre objectif de vente",
      "contenu": "Sara, tu dois atteindre 100 ventes ce mois-ci...",
      "dateEnvoi": "2025-12-10T17:00:00.000Z",
      "lu": true,  // ✅ Maintenant true
      "idExpediteur": 5
    }
  ]
}
```

---

### Scénario: Manager envoie un message à toute la squad A

**Étape 1: Manager (ahmed, squad A) se connecte** ✅ (même que avant)

**Étape 2: Manager envoie à la squad A**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "squad": "A",
    "titre": "🎯 Objectif trimestral",
    "contenu": "Chers membres de la squad A, le nouvel objectif Q4 est..."
  }'
```

Réponse:
```json
{
  "ok": true,
  "message": "Message envoyé à la squad A",
  "data": {
    "insertedCount": 3  // 3 users dans la squad A: sara, paul, lisa
  }
}
```

**Résultat en base de données:**
```sql
SELECT * FROM MESSAGE WHERE idExpediteur = 5 AND dateEnvoi = '2025-12-10 17:05:00';
-- 3 lignes créées:
-- idMessage=11, idExpediteur=5, idDestinataire=4  (sara)
-- idMessage=12, idExpediteur=5, idDestinataire=6  (paul)
-- idMessage=13, idExpediteur=5, idDestinataire=7  (lisa)
```

---

### Scénario: User enregistre une vente

**Étape 1: User (user) se connecte**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"0000"}'
```

Réponse:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "username": "user",
    "role": "user"
  }
}
```

**Étape 2: User enregistre une vente**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/vente/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_produit": 50,
    "quantite": 10,
    "adresse": "Rue de la République, 75011 Paris"
  }'
```

Réponse:
```json
{
  "message": "Vente ajoutée avec succès.",
  "id_vente": 8,
  "historique": [
    {
      "id_vente": 8,
      "id_produit": 50,
      "quantite": 10,
      "adresse": "Rue de la République, 75011 Paris",
      "date_vente": "2025-12-10T17:10:00.000Z"
    },
    {
      "id_vente": 7,
      "id_produit": 45,
      "quantite": 5,
      "adresse": "Rue de Rivoli, 75004 Paris",
      "date_vente": "2025-12-10T16:00:00.000Z"
    }
  ]
}
```

**Étape 3: User récupère son historique**
```bash
curl -X GET http://localhost:3000/vente \
  -H "Authorization: Bearer $TOKEN"
```

Réponse:
```json
{
  "ventes": [
    {
      "id_vente": 8,
      "id_produit": 50,
      "quantite": 10,
      "adresse": "Rue de la République, 75011 Paris",
      "date_vente": "2025-12-10T17:10:00.000Z"
    },
    {
      "id_vente": 7,
      "id_produit": 45,
      "quantite": 5,
      "adresse": "Rue de Rivoli, 75004 Paris",
      "date_vente": "2025-12-10T16:00:00.000Z"
    }
  ]
}
```

---

## 📝 Résumé des endpoints

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| `POST` | `/login` | Public | Authentification |
| `POST` | `/api/message/send` | manager | Envoyer message (1 user ou squad) |
| `GET` | `/api/message/` | user | Récupérer messages reçus |
| `PATCH` | `/api/message/:id/lu` | user | Marquer comme lu |
| `POST` | `/vente/add` | user | Enregistrer une vente |
| `GET` | `/vente` | user | Historique des ventes |
| `GET` | `/user` | user | Route de test |
| `GET` | `/manager` | manager | Route de test |
| `GET` | `/admin` | admin | Route de test |

---

## 🔑 Points importants

1. **Authentification requise:** Tous les endpoints sauf `/login` nécessitent un token valide
2. **Rôles:** Chaque endpoint vérifie le rôle de l'utilisateur
3. **Sécurité:** 
   - Un user ne peut marquer QUE ses propres messages
   - Les squads sont vérifiées (A, B, C, D)
   - Les titres/contenus sont validés en longueur
4. **Format JSON:** Toutes les réponses sont en JSON structuré `{ ok, message, data }`
5. **Timestamps UTC:** Les dates sont en format ISO 8601 (UTC)
