const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { subscribeToPlan, getUserSubscriptions, getAllSubscriptions } = require('../controllers/subscriptionController');
const isAdmin = require('../middlewares/isAdmin');



router.post('/', auth, subscribeToPlan);
router.get('/', auth, getUserSubscriptions);
router.get('/all', auth, isAdmin, getAllSubscriptions);

module.exports = router;
