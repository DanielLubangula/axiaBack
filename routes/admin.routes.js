const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const isAdmin = require('../middlewares/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin
const auth = require('../middlewares/auth');

router.post('/login', adminController.adminLogin);
router.get('/dashboard-stats',isAdmin, adminController.getDashboardStats);
router.get('/users/:id', isAdmin, adminController.infoUser)
router.delete('/user/:id', auth, adminController.deleteUser);
router.put('/user/update/:id',  adminController.updateAmountUser);


module.exports = router;
  