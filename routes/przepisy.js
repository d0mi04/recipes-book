const express = require('express');
const router = express.Router();
const Przepis = require('../models/Przepis');

// GET /przepisy – pobierz wszystkie
router.get('/', async (req, res) => {
  const przepisy = await Przepis.find();
  res.json(przepisy);
});

// GET /przepisy?skladnik=cebula – filtruj po składniku
router.get('/', async (req, res) => {
  const { skladnik } = req.query;
  const przepisy = await Przepis.find({ skladniki: skladnik });
  res.json(przepisy);
});

// POST /przepisy – dodaj nowy przepis
router.post('/', async (req, res) => {
  const nowy = new Przepis(req.body);
  await nowy.save();
  res.status(201).json(nowy);
});

module.exports = router;
