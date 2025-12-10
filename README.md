

## EvalCommerce

Application Node.js pour le suivi des performances commerciales dans une entreprise, permettant de gérer les ventes, les utilisateurs et de visualiser les statistiques de performance en temps réel
. But

Backend REST pour l’application d’évaluation commerciale (auth, gestion utilisateurs/squads, saisie ventes, messagerie interne, tableaux de bord & stats). Conçu pour être déployé localement ou sur un serveur.

Référence cahier des charges : Application Web d’Evaluation Commerciale.

2. Stack recommandée

Node.js (>=16) + Express

Base de données MySQL (recommandé) ou MongoDB (option)

ORM/ODM : Sequelize (MySQL) ou Mongoose (MongoDB)

Auth : JWT (jsonwebtoken), mot de passe : bcrypt

Validation : Joi / express-validator

Tests : Jest + Supertest

Visualisation : Chart.js (frontend)

Autres : dotenv, cors, helmet, express-rate-limit, winston





/backend
 ├─ routes/
 │    ├─ message.js
 │    ├─ vente.js
 │    └─ squad.js
 ├─ controllers/
 │    ├─ messageController.js
 │    ├─ venteController.js
 │    └─ squadController.js
 ├─ services/
 │    ├─ messageService.js
 │    ├─ venteService.js
 │    └─ squadService.js
 ├─ middleware/
 │    └─ auth.js
 ├─ config/
 │    └─ db.js
 └─ app.js
