require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const przepisyRoutes = require('./routes/przepisy');

const app = express();
app.use(express.json());

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB Atlas'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB', err));

// Routing
app.use('/przepisy', przepisyRoutes);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
