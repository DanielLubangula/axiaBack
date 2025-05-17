const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String,
  createdAt: Date,
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
