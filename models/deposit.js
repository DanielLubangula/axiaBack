// models/Depot.js
const mongoose = require('mongoose');

const depotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // si tu associes les dépôts à un utilisateur
    required: true
  },
   plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan1',
      required: true
    },
  amount: {
    type: Number,
    required: true
  },
  txReference: {
    type: String,
    required: true
  },
  paymentProofUrl: {
    type: String, // URL de l'image
    required: true
  },
  status: {
    type: String,
    enum: ['en attente', 'validé', 'rejeté'],
    default: 'en attente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Depot1', depotSchema);
