const express = require('express');
const Przepis = require('../models/Przepis');
const Ocena = require('../models/Ocena');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// POST /oceny/:przepisId - dodanie oceny do konkretnego przepisu - dla zalogowanego użytkownika
router.post('/:przepisId', verifyToken, async (req, res) => {
  const przepisId = req.params.przepisId;
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
      message: '✅ new rate was added to this recipe',
      ocena: nowaOcena
    });

  } catch (err) {
    res.status(500).json({
      error: err,
      message: '🖥 Server error!'
    })
  }
});

// GET /oceny/przepisId --> wyświetlenie ocen konkretnego przepisu, nie wymaga zalogowanego użytkownika
router.get('/:przepisId', async (req, res) => {
    const przepisId = req.params.przepisId;

    try {
        const oceny = await Ocena.find({ przepisId }).sort({ data: -1 });
        
        res.status(200).json({
            oceny
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            message: '🖥 Server error!'
        });
    }
});

// GET /oceny?moje-oceny="userId" --> zwrócenie wszystkich ocen, które wystawił zalgowany użytkownik


// PUT /oceny/:przepisId --> ponieważ user może wystawić dla jednego przepisu jedną ocenę, to po id przepisu może zaktualizować ocenę
router.put('/:przepisyId', verifyToken, async (req, res) => {

});

// DELETE /oceny/:idPrzepisu --> usunięcie swojej oceny dla konkretnego przepisu
router.delete(':przepisyId', verifyToken, async (req, res) => {

});

module.exports = router;