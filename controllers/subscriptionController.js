const Subscription = require('../models/Subscription');
const Plan = require('../models/plan');

exports.subscribeToPlan = async (req, res) => {
  try {
    const { planId, amount } = req.body;
    const userId = req.user.id;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan non trouvé' });

    if (amount < plan.minimumAmount) {
      return res.status(400).json({ message: `Le montant minimum pour ce plan est ${plan.minimumAmount}` });
    }

    const subscription = new Subscription({
      user: userId,
      plan: planId,
      amount
    });

    await subscription.save();
    res.status(201).json({ message: 'Souscription réussie', subscription });

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la souscription', error: err.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }).populate('plan');
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des souscriptions', error: err.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
    try {
      const subs = await Subscription.find().populate('user plan');
      res.json(subs);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };
  