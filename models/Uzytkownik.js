const mongoose = require('mongoose');

const uzytkownikSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

module.exports = mongoose.model('Uzytkownik', uzytkownikSchema);