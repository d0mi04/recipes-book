const mongoose = require('mongoose');

const przepisSchema = new mongoose.Schema({
  tytul: {type: String, required: true, unique: true}, // może byc tylko jeden przepis o tym tytule
  autor: {type: mongoose.Schema.Types.ObjectId, ref: 'Uzytkownik', required: true},
  czas: {type: Number, required: true},
  kategoria: {type: String}, // nie musi być wymagana
  skladniki: [{type: String, required: true}],
  kroki: [{type: String, required: true}],
  // ocena: {type: Number}, // nikt nie ocenił to nie musi być wymagana
  dataDodania: {
    type: Date, required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Przepis', przepisSchema);
