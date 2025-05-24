const express = require('express');
const Przepis = require('../models/Przepis');
const Uzytkownik = require('../models/Uzytkownik');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// dodawanie ulubionego przepisu
router.post('/:userId/ulubione', verifyToken, async (req, res) => {
    const userId = req.params.userId;
    const { przepisId } = req.body;

    if(!przepisId) {
        return res.status(400).json({
            message: '🤷‍♀️ No recipe ID!',
        });
    }

    try {
        const user = await Uzytkownik.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: '❌ User does not exists!',
            });
        }

        // ta część jest po to, żeby nie można było dodać kilka razy tego samego przepisu do ulubionych
        if(!user.favouriteRecipes.includes(przepisId)) { // jak nie ma przepisu, to go dodaj
            user.favouriteRecipes.push(przepisId);
            await user.save();
        }

        res.status(200).json({
            message: '✅ Recipe is added to favourites!',
            favourites: user.favouriteRecipes,
        });
        
    } catch (err) {
        console.log('Error while adding recipe to favourites.');
        res.status(500).json({
            message: '🖥 Server error!',
        });
    }
});

module.exports = router;