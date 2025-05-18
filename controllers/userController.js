const user = require('../models/User')
const moment = require('moment');

exports.getUSer = async (req, res) => {
    const userId = req.user.id;
    const info = await user.findById(userId);
    
    res.json({
        balance: info.balance,
        name: info.username,
        email: info.email,
        referralLink: info.referralLink, 
        createdAt: moment(info.createdAt).format('YYYY-MM-DD') // Format comprehensible
    });
};

exports.getAlluser = async (req, res) => {
    const users = await user.find({}).select('--password')

    res.json(users)
}