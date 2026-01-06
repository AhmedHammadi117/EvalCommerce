# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [1.0.0] - 2024

### ✨ Fonctionnalités principales

#### Système d'authentification
- Authentification JWT avec tokens sécurisés (expiration 1h)
- Hachage des mots de passe avec bcryptjs (10 salt rounds)
- Système de rôles à 3 niveaux : admin, manager, user
- Middleware de protection des routes par rôle

#### Interface utilisateur (Commercial)
- Tableau de bord avec statistiques personnelles
- Réception et lecture de messages des managers
- Filtrage des messages (lus/non-lus)
- Enregistrement des ventes avec produit, quantité et adresse
- Interface moderne avec dégradés de couleurs

#### Interface manager
- Envoi de messages individuels aux commerciaux
- Envoi de messages broadcast à l'équipe (Squad A ou B)
- Visualisation des statistiques de l'équipe
- Classement des meilleurs vendeurs
- Suivi des ventes par commercial

#### Interface administrateur
- Dashboard global avec KPIs en temps réel
- Statistiques par squad (nombre de membres, managers, ventes)
- Top 5 des meilleurs vendeurs tous squads confondus
- Statistiques produits (fois vendu, quantité totale)
- Gestion des utilisateurs (CRUD complet)
- Gestion des messages (consultation, statistiques)
- Rafraîchissement automatique toutes les 10 secondes

### 🔧 Améliorations techniques

#### Base de données
- Optimisation des requêtes SQL avec DISTINCT et CASE WHEN
- Correction du comptage des membres par squad (exclusion des managers)
- Agrégations précises pour les statistiques de ventes
- Contraintes d'intégrité référentielle (foreign keys)

#### Backend
- Architecture RESTful avec Express.js
- Séparation des responsabilités (routes/controllers/services)
- Système de logging avec Winston
- Validation des données en entrée
- Gestion centralisée des erreurs

#### Frontend
- Architecture React 18 avec Vite
- Composants modulaires et réutilisables
- Gestion d'état locale avec useState
- Récupération automatique des données
- Design responsive avec CSS personnalisé

### 🐛 Corrections de bugs

- **Fix**: Correction du comptage des membres dans les statistiques squad
  - Problème: Les managers étaient comptés comme membres d'équipe
  - Solution: Utilisation de `COUNT(DISTINCT CASE WHEN u.role='user')`

- **Fix**: Correction du calcul des ventes produits
  - Problème: Affichage des quantités au lieu du nombre de ventes
  - Solution: Utilisation de `COUNT(DISTINCT v.id_vente)` pour fois_vendu

- **Fix**: Suppression de la fonctionnalité de réponse
  - Problème: Conflit d'authentification (users ne peuvent pas envoyer)
  - Solution: Conservation de la structure originale (seuls managers envoient)

- **Fix**: Nettoyage des logs de debug
  - Problème: Console.log inutiles en production
  - Solution: Suppression de tous les logs de debug frontend/backend

### 📚 Documentation

#### Fichiers créés
- `README.md` : Documentation principale du projet
- `MANUEL_UTILISATION.md` : Guide d'utilisation détaillé par rôle
- `DOCUMENTATION_TECHNIQUE.md` : Spécifications techniques et architecture
- `GUIDE_DEMARRAGE.md` : Guide de démarrage rapide (5 minutes)
- `init_database.sql` : Script d'initialisation de la base de données
- `hashPassword.js` : Utilitaire de génération de hash bcrypt

#### Contenu documenté
- Installation et configuration complètes
- Procédures d'utilisation pour chaque rôle
- Architecture technique du système
- Schéma de base de données avec descriptions
- Liste complète des endpoints API
- Guides de dépannage

### 🔐 Sécurité

- Hachage bcrypt des mots de passe (salt rounds: 10)
- Tokens JWT signés avec secret sécurisé
- Validation des rôles côté serveur
- Protection CORS configurée
- Variables d'environnement pour données sensibles
- Middleware d'authentification sur toutes les routes protégées

### 📊 Données de test

#### Comptes utilisateurs
- **Admin**: admin1 / Admin123!
- **Manager Squad A**: manager1 / Manager123!
- **Commerciaux Squad A**: alice, bob, charlie, dave / Test123!
- **Commerciaux Squad B**: eve, frank, grace / Test123!

#### Données de démonstration
- 8 utilisateurs répartis sur 2 squads
- 10 ventes d'exemple avec dates variées
- 5 messages de test entre managers et commerciaux
- 5 produits avec stock et prix

### 🎓 Contexte académique

Ce projet a été développé dans le cadre académique avec les objectifs suivants :
- Démonstration d'une architecture 3-tiers complète
- Implémentation de rôles et permissions
- Gestion de base de données relationnelle
- Interface utilisateur moderne et intuitive
- Documentation professionnelle complète

---

**Légende**:
- ✨ Nouvelles fonctionnalités
- 🔧 Améliorations
- 🐛 Corrections de bugs
- 📚 Documentation
- 🔐 Sécurité
- 📊 Données
- 🎓 Académique
