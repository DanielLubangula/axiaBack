const Depot = require('../models/deposit');
const path = require('path');

// exports.getDepot = async (req, res) => {
//   console.log(req.params)
//   try {
//     const { amount, txReference } = req.body;
//     const file = req.file;

//     if (!amount || !txReference || !file) {
//       return res.status(400).json({ error: "Tous les champs sont requis" });
//     }

//     // URL accessible de l'image (ex: http://localhost:5000/static/uploads/...)
//     const imageUrl = `${req.protocol}://${req.get('host')}/static/uploads/${file.filename}`;
//     const depot = new Depot({
//       userId: req.user.id, // si tu récupères l'ID de l'utilisateur via le token
//       amount,
//       plan : req.params.id,
//       txReference,
//       paymentProofUrl: imageUrl
//     });

//     await depot.save();

//     res.status(201).json({ message: 'Dépôt enregistré avec succès', depot });

//   } catch (error) { 
//     console.error(error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };

exports.getDepot = async (req, res) => {
  try {
    const { amount  } = req.body;
    const file = req.file;

    if (!amount || !file) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const imageUrl = file.location; // URL S3

    const depot = new Depot({
      userId: req.user.id,
      amount,
      plan: req.params.id,
      txReference : 'RAS',
      paymentProofUrl: imageUrl,
    });

    await depot.save();

    res.status(201).json({ message: 'Dépôt enregistré avec succès', depot });

  } catch (error) {
    console.log("Erreur :", error)
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
