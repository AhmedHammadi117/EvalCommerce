# 📚 Manuel d'Utilisation - EvalCommerce

## Table des Matières
1. [Guide de Démarrage Rapide](#guide-de-démarrage-rapide)
2. [Interface Commercial](#interface-commercial)
3. [Interface Gestionnaire](#interface-gestionnaire)
4. [Interface Administrateur](#interface-administrateur)
5. [FAQ et Dépannage](#faq-et-dépannage)

---

## Guide de Démarrage Rapide

### Première Connexion

1. **Accéder à l'application**
   - Ouvrir votre navigateur web
   - Aller à l'adresse : `http://localhost:5173`

2. **Se connecter**
   - Entrer votre **nom d'utilisateur**
   - Entrer votre **mot de passe**
   - Cliquer sur **"Se connecter"**

3. **Navigation automatique**
   - Le système vous redirige automatiquement vers votre espace selon votre rôle
   - Votre nom s'affiche en haut de la page

### Rôles et Permissions

| Rôle | Accès | Fonctionnalités |
|------|-------|-----------------|
| **Commercial** | `/user` | Messages, Ventes, Statistiques personnelles |
| **Gestionnaire** | `/manager` | Envoi messages, Statistiques équipe |
| **Administrateur** | `/admin` | Dashboard complet, Gestion utilisateurs |

---

## Interface Commercial

### 📬 Gestion des Messages

#### Consulter les messages
- **Messages non lus** : Affichés par défaut avec un fond bleu clair
- **Date et heure** : Affichées en haut à droite de chaque message
- **Expéditeur** : Identifié comme "Manager #X"

#### Marquer un message comme lu
1. Cliquer sur le bouton **"✅ Marquer lu"** sous le message
2. Le message disparaît de la liste principale
3. Un message de confirmation s'affiche brièvement

#### Voir les anciens messages
1. Cliquer sur le bouton **"📂 Anciens messages"** en haut de la section
2. Tous les messages s'affichent (lus et non lus)
3. Les messages lus ont un fond gris clair
4. Cliquer à nouveau pour revenir aux messages récents

### 💰 Enregistrement des Ventes

#### Ajouter une vente
1. **Remplir le formulaire "Ajouter une vente"** :
   ```
   ID produit : [Numéro du produit]
   Quantité   : [Nombre d'unités vendues]
   Adresse    : [Adresse de livraison complète]
   ```

2. **Cliquer sur "Ajouter"**

3. **Vérification** :
   - Un message de confirmation s'affiche
   - La vente apparaît dans "Historique des ventes"
   - Les statistiques se mettent à jour automatiquement

#### Consulter l'historique
- **Liste chronologique** : Les ventes les plus récentes en premier
- **Informations affichées** :
  - Numéro de vente
  - Produit vendu
  - Quantité
  - Adresse de livraison
  - Date et heure de la vente

### 📊 Tableau de Bord Personnel

Trois indicateurs principaux (KPIs) :

1. **📩 Messages non lus**
   - Nombre de messages en attente de lecture
   - Se met à jour en temps réel

2. **💰 Ventes totales**
   - Nombre total de ventes réalisées
   - Historique complet

3. **🕘 Dernière vente**
   - Date de la vente la plus récente
   - Indicateur d'activité

---

## Interface Gestionnaire

### 👥 Vue d'Ensemble de l'Équipe

#### Statistiques de la Squad
- **Taille équipe** : Nombre de commerciaux dans votre squad
- **Actifs cette semaine** : Commerciaux ayant réalisé des ventes récemment
- **Total ventes** : Cumul des ventes de toute l'équipe

#### Cartes des Commerciaux
Chaque commercial est représenté par une carte contenant :
- **Nom et ID** du commercial
- **Nombre de ventes** réalisées
- **Bouton "📤 Envoyer message"** pour communication individuelle

### 📤 Envoi de Messages

#### Message individuel
1. Sur la carte du commercial, cliquer sur **"📤 Envoyer message"**
2. Un formulaire s'affiche :
   ```
   Titre   : [Sujet du message]
   Message : [Contenu détaillé]
   ```
3. Remplir les champs
4. Cliquer sur **"Envoyer"**
5. Confirmation instantanée

#### Message à toute l'équipe
1. Cliquer sur le bouton **"📢 Message à toute la squad"** en bas de page
2. Le même formulaire s'affiche
3. Le message sera envoyé **automatiquement à tous les commerciaux** de votre squad
4. Confirmation du nombre de destinataires

#### Bonnes Pratiques
- ✅ Utiliser des titres courts et explicites
- ✅ Écrire des messages clairs et constructifs
- ✅ Vérifier le destinataire avant d'envoyer
- ⚠️ Les messages ne peuvent pas être supprimés après envoi

---

## Interface Administrateur

### 📊 Dashboard Statistiques

#### Vue Globale
Le dashboard se divise en plusieurs sections :

1. **KPIs Principaux** (4 cartes colorées)
   - 📦 **Ventes totales** : Nombre de transactions
   - 📊 **Quantité vendue** : Articles vendus au total
   - ✉️ **Messages envoyés** : Communications globales
   - 👥 **Utilisateurs actifs** : Membres inscrits

2. **Statistiques par Squad**
   - Cartes par équipe (A, B, C, D)
   - Nombre de ventes par squad
   - Nombre de membres
   - Code couleur par squad

3. **🥇 Top Vendeurs**
   - Classement des 10 meilleurs commerciaux
   - Médailles d'or, argent, bronze pour le podium
   - Nombre de ventes et quantités vendues
   - Badge coloré pour le top 3

4. **📦 Produits les Plus Vendus**
   - Top 6 des produits
   - Nombre de ventes par produit
   - Quantité totale vendue

5. **💬 Statistiques Messages**
   - Total des messages
   - Messages lus
   - Messages non lus

#### Rafraîchissement Automatique
- **Mise à jour** : Toutes les 10 secondes
- **Indicateur** : Point vert clignotant en haut à droite
- **Heure de mise à jour** : Affichée à côté de l'indicateur

### 👥 Gestion des Utilisateurs

#### Consulter les utilisateurs
- **Liste complète** : Tous les utilisateurs du système
- **Informations affichées** :
  - ID utilisateur
  - Nom d'utilisateur
  - Rôle (admin, manager, user)
  - Squad assignée
  - Date de création

#### Créer un utilisateur

1. **Cliquer sur "Créer un utilisateur"**

2. **Remplir le formulaire** :
   ```
   Username : [Nom d'utilisateur unique]
   Password : [Mot de passe sécurisé]
   Role     : [Sélectionner admin/manager/user]
   Squad    : [A, B, C, ou D - si applicable]
   ```

3. **Règles de validation** :
   - Username : minimum 3 caractères, unique
   - Password : minimum 4 caractères
   - Squad : obligatoire pour manager et user

4. **Soumettre**
   - Confirmation immédiate
   - L'utilisateur apparaît dans la liste

#### Modifier un utilisateur

1. **Localiser l'utilisateur** dans la liste
2. **Cliquer sur "Modifier"**
3. **Formulaire pré-rempli** avec les données actuelles
4. **Modifier** les champs nécessaires :
   - Username
   - Role
   - Squad
   - ⚠️ Le mot de passe ne peut pas être modifié ici
5. **Sauvegarder**

#### Supprimer un utilisateur

1. **Cliquer sur "Supprimer"** à côté de l'utilisateur
2. **Confirmation** : Une fenêtre de confirmation s'affiche
3. **Confirmer** la suppression
4. ⚠️ **Action irréversible** : L'utilisateur et ses données seront supprimés

#### Bonnes Pratiques Administrateur
- ✅ Créer des usernames clairs et identifiables
- ✅ Assigner les squads correctement (un manager par squad)
- ✅ Utiliser des mots de passe forts pour tous les comptes
- ⚠️ Ne pas supprimer d'utilisateurs avec des données critiques
- ⚠️ Vérifier les statistiques avant modification massive

---

## FAQ et Dépannage

### Questions Fréquentes

**Q : Je n'arrive pas à me connecter**
- Vérifier que le serveur backend est démarré (port 3000)
- Vérifier que le serveur frontend est démarré (port 5173)
- Vérifier vos identifiants (username et password sont sensibles à la casse)
- Vider le cache du navigateur et réessayer

**Q : Mes messages n'apparaissent pas**
- Actualiser la page avec F5
- Vérifier que vous êtes dans l'onglet "Messages récents" (non lus par défaut)
- Cliquer sur "Anciens messages" pour voir l'historique complet

**Q : Je ne peux pas envoyer de message (commercial)**
- Les commerciaux ne peuvent pas envoyer de messages
- Seuls les gestionnaires ont cette permission
- Contactez votre gestionnaire pour toute communication

**Q : Les statistiques ne se mettent pas à jour**
- Pour les admins : le rafraîchissement est automatique toutes les 10 secondes
- Pour les autres : actualiser la page manuellement (F5)
- Vérifier la connexion réseau

**Q : Erreur "Accès refusé"**
- Vous essayez d'accéder à une fonctionnalité non autorisée pour votre rôle
- Vérifier votre rôle dans le système
- Contacter un administrateur si le problème persiste

**Q : Mon mot de passe ne fonctionne plus**
- Contacter un administrateur pour réinitialisation
- Les administrateurs peuvent créer un nouveau compte si nécessaire

### Messages d'Erreur Courants

| Message | Signification | Solution |
|---------|---------------|----------|
| "Token invalide ou expiré" | Session expirée (1h) | Se reconnecter |
| "Accès refusé" | Permission insuffisante | Vérifier votre rôle |
| "Erreur serveur interne" | Problème backend | Vérifier les serveurs |
| "Impossible de contacter le serveur" | Connexion réseau | Vérifier la connexion |
| "Champs manquants" | Formulaire incomplet | Remplir tous les champs |

### Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `F5` | Actualiser la page |
| `Ctrl+R` | Actualiser la page |
| `Ctrl+Shift+R` | Actualiser (cache vidé) |
| `Esc` | Fermer un modal/formulaire |

### Problèmes Techniques

**Page blanche après connexion**
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs JavaScript
3. Vérifier que le token est stocké (onglet Application > Local Storage)
4. Se déconnecter et se reconnecter

**Données incohérentes**
1. Actualiser la page
2. Vider le cache du navigateur
3. Se déconnecter et se reconnecter
4. Contacter l'administrateur si le problème persiste

**Performance lente**
1. Fermer les onglets inutiles
2. Vider le cache du navigateur
3. Vérifier la connexion réseau
4. Redémarrer le navigateur

---

## 📞 Support

Pour toute question ou problème :
1. Consulter ce manuel
2. Vérifier les logs du serveur (backend)
3. Consulter la console du navigateur (F12)
4. Contacter l'administrateur système

---

## 🔄 Mises à Jour

Ce manuel correspond à la version actuelle de l'application.  
Dernière mise à jour : Janvier 2026

---

**Bonne utilisation d'EvalCommerce !** 🎉
