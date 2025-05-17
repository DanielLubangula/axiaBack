const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const User = require('../models/user'); // Assurez-vous que le modèle User est correctement importé
// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Route protégée
router.get('/me', auth, getMe);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


router.get('/profil', auth, (req, res) => {
  res.json({ message: 'Voici ton profil', userId: req.user.id });
});


module.exports = router;
