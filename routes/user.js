/*
  User related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewars
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const { starRecipe, listUserRecipe } = require('../controllers/user');

// routes
router.put(
  '/user/star/recipe/:recipeId',
  requireSignIn,
  authMiddleware,
  starRecipe
);

router.get('/user/:userId/recipes', listUserRecipe);

// update detail
// TODO

module.exports = router;
