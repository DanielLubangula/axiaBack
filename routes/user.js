const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth');

router.get('/getuser', auth, userController.getUSer)

router.get('/alluser', userController.getAlluser)

module.exports = router