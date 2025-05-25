const express = require('express');
const Przepis = require('../models/Przepis');
const Uzytkownik = require('../models/Uzytkownik');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// GET /uzytkownik/:id/ulubione --> zwracanie wszystkich ulubionych przepisów
router.get('/:userId/ulubione', verifyToken, async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await Uzytkownik.findById(userId);

        if(!user) {
            return res.status(404).json({
                message: '⛔ User does not exist!'
            });
        }

        // znajdowanie istniejących przepisów:
        const existingRecipes = await Przepis.find({_id: { $in: user.favouriteRecipes }});
        const existingRecipeIds = existingRecipes.map(recipe => recipe._id.toString());

        // sprawdzenie, czy tablica favouriteRecipes jest aktualna - sprawdzanie czy znajdują się tam ID nieistniejących przepisów
        const cleanedList = user.favouriteRecipes.filter(
            id => existingRecipeIds.includes(id.toString())
        );

        if(cleanedList.length !== user.favouriteRecipes.length) {
            // usuwamy nieistniejące i zapisujemy
            user.favouriteRecipes = cleanedList;
            await user.save();
        }
        
        res.status(200).json({
            favouriteRecipes: user.favouriteRecipes
        });
    } catch (err) {
        res.status(500).json({
            message: '🖥 Server error!',
            error: err.message
        });
    }    
})

// POST /uzytkownik/:id/ulubione --> dodawanie ulubionego przepisu
router.post('/:userId/ulubione', verifyToken, async (req, res) => {
    const userId = req.params.userId;
    const { przepisId } = req.body;

    try {
        const user = await Uzytkownik.findById(userId);

        if(!user) {
            return res.status(404).json({
                message: '⛔ User does not exist!'
            });
        }

        // sprawdzenie, czy id, które jest podawane w body faktycznie istnieje:
        const isvalidRecipe = await Przepis.findById(przepisId);
        if(!isvalidRecipe) {
            return res.status(404).json({
                message: '⛔ Recipe does not exists!'
            })
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
            message: '🖥 Server error!'
        });
    }
});

// DELETE /uzytkownik/:userId/ulubione --> usuwanie przepisu z listy ulubionych
router.delete('/:userId/ulubione/:przepisId', verifyToken, async (req, res) => {
    const { userId, przepisId  } = req.params;

    try {
        const user = await Uzytkownik.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: '⛔ User does not exists!'
            });
        }

        // 404: przepis już usunięty / przepisu o podanym id nie ma w liście ulubione
        const index = user.favouriteRecipes.findIndex(
            id => id.toString() === przepisId
        );

        if(index === -1) {
            return res.status(404).json({
                message: '⛔ Recipe does not exists in Favourite Recipes!'
            });
        }

        // usuwanie z ulubionych
        user.favouriteRecipes = user.favouriteRecipes.filter(
            id => id.toString() !== przepisId
        );
        await user.save();

        res.status(200).json({
            message: '✅ Recipe was deleted successfully',
            favouriteRecipes: user.favouriteRecipes
        });
    } catch (err) {
        res.status(500).json({
            message: '🖥 Server error!',
            error: err.message
        });
    }
});


module.exports = router;