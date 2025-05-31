const express = require('express');
const Przepis = require('../models/Przepis');
const Ocena = require('../models/Ocena'); // faza 2️⃣ - wyświetlanie średniej oceny
const verifyToken = require('../middleware/authMiddleware');

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
router.post('/', async (req, res) => {
  const nowy = new Przepis(req.body);
  await nowy.save();
  res.status(201).json(nowy);
});

// PUT /przepisy/:id – edytuj przepis
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const noweDane = req.body;

    const zaktualizowany = await Przepis.findByIdAndUpdate(id, noweDane, {
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuniety = await Przepis.findByIdAndDelete(id);

    if (!usuniety) {
      return res.status(404).json({ message: '🫢 Nie znaleziono przepisu do usunięcia' });
    }

    res.json({ message: '✅ Przepis został usunięty', przepis: usuniety });
  } catch (err) {
    console.error('❌ Błąd przy usuwaniu przepisu:', err);
    res.status(500).json({ message: '❌ Błąd serwera' });
  }
});

// POST /przepisy/:id/oceny - dodanie oceny do konkretnego przepisu - dla zalogowanego użytkownika
router.post('/:id/oceny', verifyToken, async (req, res) => {
  const przepisId = req.params.id;
  const { ocena, komentarz } = req.body;
  const userId = req.user.userId;

  try {
    const przepis = await Przepis.findById(przepisId);
    if(!przepis) {
      return res.status(404).json({
        message: '⛔ Recipe does not exist!'
      });
    }

    // sprawdzenie, czy ocena jest z zakresu 1-5
    if(ocena < 1 || ocena > 5) {
      return res.status(400).json({
        message: '⛔ Rate is out of range!'
      });
    }

    // sprawdzenie, czy ocena już istnieje --> zabezpieczenie przed dodawaniem wielu komentarzy przez tego samego użytkownika
    const existing = await Ocena.findOne({ przepisId, userId });
    if(existing) {
      return res.status(400).json({
        message: '⛔ Recipe has been already rated!'
      });
    }

    // tworzenie nowej oceny
    const nowaOcena = new Ocena({
      przepisId,
      userId,
      ocena,
      komentarz
    });

    await nowaOcena.save();

    res.status(201).json({
      message: '✅ new rate was added to this recipe'
    });

  } catch (err) {
    res.status(500).json({
      error: err,
      message: '🖥 Server error!'
    })
  }
});

module.exports = router;
