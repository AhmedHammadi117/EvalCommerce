Client React (squelette)

Pour lancer l'interface React en développement (Vite):

1. Aller dans le dossier `client`
2. Installer les dépendances:

```powershell
cd client; npm install
```

3. Lancer le serveur de développement:

```powershell
npm run dev
```

Le dev server Vite tourne par défaut sur `http://localhost:5173`.

Notes:
- L'application client est un squelette léger (Login + Dashboard) prêt à être étendu.
- Pendant le développement, le backend doit autoriser l'origine `http://localhost:5173`. Utiliser `.env` pour changer `FRONTEND_ORIGIN`.

Intégration avec le backend:
- L'URL de l'API est lue depuis `import.meta.env.VITE_API_URL` (fallback `http://localhost:3000`).
- Après connexion, le token JWT reçu doit être stocké dans `localStorage` sous la clé `token`.
- Toutes les requêtes protégées envoient l'en-tête `Authorization: Bearer <token>`.

Exemple `.env` pour le client (créér `client/.env`):
```
VITE_API_URL=http://localhost:3000
```

Notes:
- En dev, Vite sert les fichiers front et proxie les appels vers `VITE_API_URL`.
- Vérifier que le backend autorise l'origine `http://localhost:5173` via `FRONTEND_ORIGIN` si besoin.
