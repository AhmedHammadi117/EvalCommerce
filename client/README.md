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
