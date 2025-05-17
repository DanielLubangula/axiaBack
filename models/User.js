const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  balance: { // l’argent que l’utilisateur possède.
    deposit : { type : Number , default : 0},
    earning : { type : Number , default : 0}
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },  
  referredBy: { //lien vers le parrain (s’il en a un).
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  referralLink: { // un lien unique pour inviter d’autres.
    type: String,
    unique: true,
  },

  referrals: [{ // tableau de ceux qu’il a parrainés.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
