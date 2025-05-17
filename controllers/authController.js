const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Génère un JWT
const generateToken = (id, usertoken) => {
  return jwt.sign({ id, usertoken }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, referredBy, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const referralLink = `${username}-${Date.now()}`; // simple génération de lien
 
    const newUser = new User({ 
      username, 
      email,
      password: hashedPassword,
      role : role || "user",
      referredBy: referredBy || null,
      referralLink,
    });

    await newUser.save();

    const usertoken = {
        username,
        email,
        role 
    }

    res.status(201).json({
      message: 'Inscription réussie',
      token: generateToken(newUser._id, usertoken),
      name : username,
      email : email
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const usertoken = {
        username : user.username,
        email : user.email,
        role : user.role 
    }

    res.json({
      message: 'Connexion réussie',
      token: generateToken(user._id, usertoken),
      name : user.username, 
      email : user.email
    });
  } catch (err) {
    res.statusSZ(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
