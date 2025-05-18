const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/retraits');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin

router.post('/request', auth, async (req, res) => {
  const { amount, network, walletAddress } = req.body;

  // console.log('Données de retrait :', req.body);
  // console.log('Utilisateur connecté :', req.user);
  if (!amount || !network || !walletAddress) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (amount < 5) {
    return res.status(400).json({ message: 'Montant minimum de retrait : 5 $' });
  }

  if (!['TRC20', 'BEP20'].includes(network)) {
    return res.status(400).json({ message: 'Réseau non supporté' });
  }

  try {
    // Recharger les données complètes de l'utilisateur
    const user = await User.findById(req.user.id);
    console.log('Utilisateur trouvé :', user);

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const availableEarnings = user.balance.earning || 0;

    console.log('amount', amount, "availableEarnings", availableEarnings)
    if (amount > availableEarnings) {
      return res.status(400).json({
        message: `Montant demandé (${amount}$) supérieur au gain disponible (${availableEarnings}$)`
      });
    }

    const withdrawal = new Withdrawal({
      user: user._id,
      amount,
      network,
      walletAddress,
      status: 'pending', // statut par défaut
    });

    // Optionnel : soustraire temporairement les gains ?
    // user.balance.earning -= amount;
    // await user.save();

    await withdrawal.save();
    res.status(201).json({ message: 'Demande de retrait envoyée avec succès.' });
  } catch (error) {
    console.log('Erreur retrait :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


// GET all withdrawal requests (admin only)
router.get('/allretraits',  isAdmin, async (req, res) => {
  try {
    const demandes = await Withdrawal.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(demandes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// PATCH /api/admin/retrait/:id
router.put('/updateretrait/:id', isAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }
  
  try {
    const retrait = await Withdrawal.findById(req.params.id).populate('user');
    if (!retrait) return res.status(404).json({ message: 'Demande non trouvée' });
    console.log('ici0', retrait.status)
    // if (retrait.status !== 'pending') {
    //   return res.status(400).json({ message: 'Cette demande a déjà été traitée' });
    // }
    console.log("ici", status)
    
    retrait.status = status;
    await retrait.save();
    
    // Si approuvé, on retire les fonds de earning
    if (status === 'approved') {
      retrait.user.balance.earning -= retrait.amount;
      await retrait.user.save();
    }


    res.status(200).json({ message: `Demande ${status} avec succès.` });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
    console.log("Erreur",err)
  }
});

module.exports = router;
