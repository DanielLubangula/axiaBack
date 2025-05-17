const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDepot } = require('../controllers/depositController');
const auth = require('../middlewares/auth');
const User = require('../models/user')

// config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route POST
router.post('/:id',auth, upload.single('paymentProof'), getDepot);

const Depot = require('../models/deposit');

router.get('/', async (req, res) => {
  try {
    const all = await Depot.find({})
      .populate('userId', 'username email') // On ne récupère que le nom et l’email
      .sort({ createdAt: -1 }); // Optionnel : pour avoir les plus récents en premier

    res.json({ all });
  } catch (err) {
    console.error('Erreur lors de la récupération des dépôts :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const all = await Depot.findById(userId)
      .populate('userId', 'username email') // On ne récupère que le nom et l’email
      .sort({ createdAt: -1 }); // Optionnel : pour avoir les plus récents en premier

    res.json({ all });
  } catch (err) {
    console.error('Erreur lors de la récupération des dépôts :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});
// Modifier le statut d’un dépôt
router.put('/:id', async (req, res) => {
  try {
    const depotId = req.params.id;
    const { status } = req.body;

    // Vérifier que le statut est valide
    const validStatuses = ['en attente', 'validé', 'rejeté'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }
    const depotAncien = await Depot.findById(depotId)
    // Mettre à jour le dépôt
    const updatedDepot = await Depot.findByIdAndUpdate(
      depotId,
      { status },
      { new: true }
    ).populate('userId', 'username email');

    console.log("updatedDepot", updatedDepot)
    console.log("depotAncien", depotAncien.status)
    console.log("click", status)

    if(depotAncien.status !== 'validé'){
      if (status === "validé"){
        const user = await User.findOne({email : updatedDepot.userId.email})
        
        user.balance.deposit = Number(Number(updatedDepot.amount )+ Number(user.balance.deposit))
        console.log(' + user.balance.deposit', user.balance.deposit)
  
        await user.save()
      }
    }

    if(depotAncien.status !== 'rejeté'){
      if (status === "rejeté"){
        const user = await User.findOne({email : updatedDepot.userId.email})
        console.log("deposit", Number(user.balance.deposit) , 'amout',Number(updatedDepot.amount ) )
        user.balance.deposit = Number(Number(user.balance.deposit) - Number(updatedDepot.amount ) )
        console.log(' + user.balance.deposit', user.balance.deposit)
        await user.save()
      }
    }


   

    if (!updatedDepot) {
      return res.status(404).json({ message: 'Dépôt non trouvé.' });
    }

    res.status(200).json({ message: 'Statut mis à jour.', depot: updatedDepot });
  } catch (err) {
    console.log('Erreur', err)
    res.status(500).json({ message: 'Erreur lors de la mise à jour.', error: err.message });
  }
});

module.exports = router;
 