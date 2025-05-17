const express = require('express');
const router = express.Router();
const { createPlan, getAllPlans, updatePlan, deletePlan } = require('../controllers/planController');
const auth = require('../middlewares/auth');

// Route accessible aux admins (tu pourras filtrer plus tard avec un rôle admin)
router.post('/',  createPlan);

// Route publique pour voir les plans
router.get('/', getAllPlans);

// ✅ Mettre à jour un plan
router.put('/:id', updatePlan);

// ✅ Supprimer un plan
router.delete('/:id', deletePlan);

module.exports = router;
