/*
  User related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewars
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const { starRecipe } = require('../controllers/user');

// routes
router.put(
  '/user/star/recipe/:recipeId',
  requireSignIn,
  authMiddleware,
  starRecipe
);

// update detail
// TODO

module.exports = router;
