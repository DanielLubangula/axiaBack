const express = require('express')
const router = express.Router()
const notifController = require('../controllers/notifs.controllers')
const auth = require('../middlewares/auth');

router.get("/info", auth,  notifController.getUserDepots )

module.exports = router