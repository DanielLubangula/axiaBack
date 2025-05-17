const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const depositManuel = require('./routes/depositManuel')
const userController = require('./routes/user')
const adminRoutes = require('./routes/admin.routes');
const notifRoutes = require('./routes/notifRoutes')
const path = require("path")
const retrait = require('./routes/retraitRoutes')

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public'))); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/deposits/manual', depositManuel);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userController);
app.use('/api/admin', adminRoutes);
app.use('/notification', notifRoutes)
app.use('/api/retrait', retrait)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
