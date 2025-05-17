
const Depot = require('../models/deposit'); // attention au nom du modèle
const Retrait = require('../models/Retraits'); // attention au nom du modèle

exports.getUserDepots = async (req, res) => {
  try {
      console.log(req.user)
    const userId = req.user.id; // supposé que l'utilisateur est authentifié via middleware

    const depots = await Depot.find({ userId })
      .sort({ createdAt: -1 }) // du plus récent au plus ancien
      .populate('userId', 'username email') // facultatif mais utile
      .populate('plan', 'vipLevel investmentRange')

      const retraits = await Retrait.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username email'); 
    res.status(200).json({ depots,retraits : retraits });
    console.log(depots, retraits)
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: err.message });
  }
};
