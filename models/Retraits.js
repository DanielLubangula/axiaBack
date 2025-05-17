const mongoose = require('mongoose');

const RetraitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      network: {
        type: String,
        enum: ['TRC20', 'BEP20'],
        required: true,
      },
      walletAddress: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model('Retrait', RetraitSchema);