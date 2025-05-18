
const jwt = require('jsonwebtoken');
const Deposit = require('../models/deposit');
const Withdrawal = require('../models/withdrawal');
const User = require('../models/User');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Créer le token
      const token = jwt.sign(
        {
          email: email,
          isAdmin: true
        },
        process.env.JWT_SECRET, 
        { expiresIn: '7d' } // ou '1h', selon ce que tu veux
      );

      return res.status(200).json({
        token : token
      });
    } else {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalBalanceResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    const totalBalance = totalBalanceResult[0]?.total || 0;

    const totalDepositsResult = await Deposit.aggregate([
      { $match: { status: 'validé' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDeposits = totalDepositsResult[0]?.total || 0;

    const totalWithdrawalsResult = await Withdrawal.aggregate([
      { $match: { status: 'validé' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = totalWithdrawalsResult[0]?.total || 0;

    res.json({
      totalUsers,
      totalBalance,
      totalDeposits,
      totalWithdrawals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const Depot = require('../models/deposit')
const Retrait = require('../models/Retraits')

exports.infoUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate('referrals', 'username email')
      .populate('referredBy', 'username email');

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const depots = await Depot.find({ userId }).sort({ createdAt: -1 });
    const retraits = await Retrait.find({user : userId }).sort({ createdAt: -1 });
     console.log("ici", retraits)  
    res.json({
      user,
      depots,
      retraits
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log('ici', req.params.id) 
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
 
    // Supprimez les dépôts associés à l'utilisateur
    await Depot.deleteMany({ userId });
 
    // Supprimez les retraits associés à l'utilisateur
    await Retrait.deleteMany({ userId });

    // Supprimez l'utilisateur
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.updateAmountUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const { balance, email, username } = req.body;

    // ✅ Utilisation correcte des noms de champs
    if (balance) {
      user.balance.deposit = Number(balance.deposit) || 0;
      user.balance.earning = Number(balance.earning) || 0;

      console.log('user 1', user)
    }

    if (email) user.email = email;
    if (username) user.username = username;

    await user.save();
    console.log('user 2', user)

    res.status(200).json({ message: 'Montant mis à jour avec succès', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
