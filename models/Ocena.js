const mongoose = require('mongoose');

const ocenaSchema = new mongoose.Schema({
    przepisId: {type: mongoose.Schema.Types.ObjectId, ref: 'Przepis', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Uzytkownik', required: true },
    ocena: { type: Number, required: true, min: 1, max: 5 },
    komentarz: { type: String, required: false },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ocena', ocenaSchema);