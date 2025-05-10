const mongoose = require('mongoose');

const przepisSchema = new mongoose.Schema({
  tytul: String,
  autor: String,
  czas: Number,
  kategoria: String,
  skladniki: [String],
  kroki: [String],
  ocena: Number,
  dataDodania: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Przepis', przepisSchema);
