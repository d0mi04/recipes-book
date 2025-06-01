const express = require('express');
const Przepis = require('../models/Przepis');
const Ocena = require('../models/Ocena'); // faza 2️⃣ - wyświetlanie średniej oceny
const verifyToken = require('../middleware/authMiddleware');
const Uzytkownik = require('../models/Uzytkownik');

const router = express.Router();

// GET /przepisy?skladnik=cebula – filtrowanie po składniku
router.get('/', async (req, res) => {
  try {
    const { skladnik } = req.query;
    let query = {};

    console.log('Parametry zapytania:', req.query);

    if (skladnik) {
      query.skladniki = { $regex: new RegExp(skladnik, 'i') }; // + ignorowanie wielkości liter (chyba), można to będzie zamienić na jakieś toLowerCase() czy coś
    }

    const przepisy = await Przepis.find(query); // przepisy sprawdzamy z query
    const wszystkieOceny  = await Ocena.find(); // oceny bierzemy wszystkie

    // faza 2️⃣ konceptu - szukanie wszystkich ocen dla tego przepisu
    // teraz tworzymy mapę ocen dla każdego przepisu
    const ocenyMap = {}; // klucz: przepisId, wartość: tablica ocen
    wszystkieOceny.forEach( o => {
      if(!ocenyMap[o.przepisId]) {
        ocenyMap[o.przepisId] = [];
      }
      ocenyMap[o.przepisId].push(o.ocena);
    });

    // dodawanie średniej oceny do każdego przepisu:
    const przepisyZOcenami = przepisy.map(przepis => {
      const oceny = ocenyMap[przepis._id] || [];
      const sredniaOcena = oceny.length > 0 ? (oceny.reduce((suma, o) => suma + o, 0) / oceny.length).toFixed(2) : 'brak ocen';
    
      return {
      ...przepis.toObject(), // zlepiamy przepis i ocenę w całość i zapisujemy w przepisyZOcenami
      ocena: sredniaOcena
    };
    })
   
    res.status(200).json({
      przepisyZOcenami
    });
    

  } catch (err) {
    console.error('🫢 Błąd przy pobieraniu przepisów:', err);
    res.status(500).json({ message: '❌ Błąd serwera' });
  }
});

// GET /przepisy/:id - wyszukiwanie przepisu po id
// faza 2️⃣ konceptu - wyświetlanie oceny jako średniej z ocen
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const przepis = await Przepis.findById(id);

    if (!przepis) {
      return res.status(404).json({ message: '🫢 Nie znaleziono przepisu' });
    }

    // faza 2️⃣ konceptu - szukanie wszystkich ocen dla tego przepisu
    const oceny = await Ocena.find({ przepisId: id });
    let sredniaOcena = 'brak ocen';

    if(oceny.length > 0) {
      // sumowanie ocen
      let suma = 0;

      for(const o of oceny) {
        suma += o.ocena;
      }

      // liczenie średniej:
      sredniaOcena = (suma / oceny.length).toFixed(2); // .toFixed(2) - 2 miejsca po przecinku
    }

    // teraz trzeba połączyć te odpowiedź z przepisów i ocen w jedno:
    res.status(200).json({
      ...przepis.toObject(), // tu trzeba przekonwertować Mongoose model do czystego obiektu JS
      ocena: sredniaOcena
    });

  } catch (err) {
    console.error('🫢 Błąd przy pobieraniu przepisu:', err);
    res.status(500).json({ message: '❌ Błąd serwera' });
  }
});


// POST /przepisy – dodaj nowy przepis
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { tytul, czas, kategoria, skladniki, kroki } = req.body;

  if (!tytul || !czas || !skladniki || !kroki) {
    return res.status(400).json({ 
    message: '⛔ Wypełnij wszystkie wymagane pola!' 
    });
  }

  try {
    const nowyPrzepis = new Przepis({
      tytul,
      autor: userId, // to jest wzięte z tokena
      czas,
      kategoria,
      skladniki,
      kroki
    });

    await nowyPrzepis.save();

    // dodanie id przepisu do tablicy myRecipes autora przepisu
    await Uzytkownik.findByIdAndUpdate(userId, {
      $addToSet: { myRecipes: nowyPrzepis._id } // to ma pomóc uniknąć duplikaów
    });

    res.status(201).json({
      message: '✅ new recipe has been created!',
      przepis: nowyPrzepis
    });

  } catch (err) {
      res.status(500).json({
        error: err.message, 
        message: '🖥 Server error!'
    });
  }

});

// PUT /przepisy/:id – edytuj przepis
router.put('/:przepisId', verifyToken, async (req, res) => {
  const { przepisId } = req.params;
  const userId = req.user.userId;
  const noweDane = req.body;
  
  try {
    const zaktualizowany = await Przepis.findByIdAndUpdate(przepisId, noweDane, {
      new: true, // zwraca nowy dokument po aktualizacji
      runValidators: true, // sprawdza zgodność z schemą
    });

    if (!zaktualizowany) {
      return res.status(404).json({ message: '☹️ Nie znaleziono przepisu' });
    }

    res.json(zaktualizowany);
  } catch (err) {
    console.error('❌ Błąd przy aktualizacji przepisu:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /przepisy/:id – usuwanie przepisu - po id
router.delete('/:przepisId', verifyToken, async (req, res) => {
  const { przepisId } = req.params;
  const userId = req.user.userId;

  try {
    const usuniety = await Przepis.findById(przepisId);
    if (!usuniety) {
      return res.status(404).json({ 
        message: '🫢 Nie znaleziono przepisu do usunięcia' 
      });
    }

    await usuniety.deleteOne();

    // usuwanie Id przepisu z moje-przepisy --> dla autora przepisu
    await Uzytkownik.findByIdAndUpdate( userId, {
      $pull: {myRecipes: przepisId }
    });

    // ktoś inny może mieć ten przepis w ulubionych --> trzeba mu go usunąć
    await Uzytkownik.deleteMany(
      { favouriteRecipes: przepisId },
      { $pull: { favouriteRecipes: przepisId }}
    );

    // usuwanie wszystkich ocen powiązanych z tym przepisem
    await Ocena.deleteMany({ przepisId });

    res.json({ 
      message: '✅ Przepis został usunięty', 
      przepis: usuniety 
    });
  } catch (err) {
    console.error('❌ Błąd przy usuwaniu przepisu:', err);
    res.status(500).json({ message: '❌ Błąd serwera' });
  }
});

module.exports = router;
