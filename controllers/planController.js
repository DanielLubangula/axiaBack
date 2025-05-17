const Plan = require('../models/plan');

// Créer un plan
exports.createPlan = async (req, res) => {
  try {
    
    const { vipLevel, investmentRange, duration, weeklyReturn } = req.body;
    const plan = new Plan({ vipLevel, investmentRange, duration, weeklyReturn });
    await plan.save();
    res.status(201).json({ message: 'Plan créé avec succès', plan });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du plan', error: err.message });
  }
};

// Obtenir tous les plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
    res.status(200).json(plans)
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plans', error: err.message });
  } 
};

// Modifier un plan
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { vipLevel, investmentRange, duration, weeklyReturn } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { vipLevel, investmentRange, duration, weeklyReturn },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan non trouvé" });
    }

    res.status(200).json({ message: "Plan mis à jour avec succès", plan: updatedPlan });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du plan", error: err.message });
  }
};

// Supprimer un plan
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan non trouvé" });
    }

    res.status(200).json({ message: "Plan supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du plan", error: err.message });
  }
};
