# Fichiers suggérés pour archivage (move to `temp_unused/` before final git push)

Ces fichiers semblent être des pages statiques, anciens documents ou utilitaires de développement non nécessaires pour la version finale backend+React :

- public/index.html
- public/user.html
- public/manager.html
- public/admin.html
- public/data/sales.json
- API.md (documentation complète, gros fichier -> archive séparément)
- test.js
- ajouter.js (script de seed, garder seulement si nécessaire)
- readme.md (anciennes versions) — vérifier si dupliqué

Procédure recommandée:
1. Créer `temp_unused/` à la racine du repo.
2. Déplacer les fichiers listés dans `temp_unused/`.
3. Committer la suppression depuis la racine (`git rm`) puis `git commit -m "archive: move legacy static files to temp_unused"`.

Gardez en workspace seulement les fichiers nécessaires à l'exécution (backend + `client/`).
