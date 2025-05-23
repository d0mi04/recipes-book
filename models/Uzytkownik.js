const mongoose = require('mongoose');

const uzytkownikSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true,},
    email: {type: String, required: true, unique: true,},
    password: {type: String, required: true,},
    favouriteRecipes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Przepis',},
    ],
    myRecipes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Przepis',},
    ],
});

module.exports = mongoose.model('Uzytkownik', uzytkownikSchema);