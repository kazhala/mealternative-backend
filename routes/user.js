/*
  User related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewars
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const { bookmarkRecipe, listUserRecipe } = require('../controllers/user');

// routes
router.put(
  '/user/bookmarks/recipe/:recipeId',
  requireSignIn,
  authMiddleware,
  bookmarkRecipe
);

router.get('/user/:userId/recipes', listUserRecipe);

// update detail
// TODO

module.exports = router;
