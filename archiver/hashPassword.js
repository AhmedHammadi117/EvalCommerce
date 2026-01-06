// Script helper pour générer des mots de passe hashés
// Utilisation: node hashPassword.js <mot_de_passe>

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('❌ Usage: node hashPassword.js <mot_de_passe>');
  console.log('Exemple: node hashPassword.js admin123');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
  
  console.log('\n✅ Mot de passe hashé avec succès!');
  console.log('\nMot de passe clair:', password);
  console.log('Hash bcrypt:', hash);
  console.log('\nUtilisez ce hash dans votre requête SQL:');
  console.log(`INSERT INTO users (username, password, role, squad) VALUES ('username', '${hash}', 'user', 'A');`);
  console.log('');
});
