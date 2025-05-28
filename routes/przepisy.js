const express = require('express');
const Przepis = require('../models/Przepis');
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

    const przepisy = await Przepis.find(query);
    res.json(przepisy);
  } catch (err) {
    console.error('🫢 Błąd przy pobieraniu przepisów:', err);
    res.status(500).json({ message: '❌ Błąd serwera' });
  }
});

// GET /przepisy/:id - wyszukiwanie przepisu po id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const przepis = await Przepis.findById(id);

    if (!przepis) {
      return res.status(404).json({ message: '🫢 Nie znaleziono przepisu' });
    }

    res.json(przepis);
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

// używanie autoryzacji w przypadku przejścia do zakładki ulubione - tylko dla zalogowanego użytkownika
router.get('/ulubione', verifyToken, (req, res) => {
  res.json({
    message: `✅ Access is granted for user: ${req.user.username}`
  });
});


module.exports = router;
