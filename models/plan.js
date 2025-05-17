const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  vipLevel: {
    type: String,
    required: true
  },
  investmentRange: {
    type: String, // en pourcentage
    required: true
  },
  duration: {
    type: String, // en jours ou mois
    required: true
  },
  weeklyReturn: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Plan1', planSchema);
