/*
  recipe route
*/

// express
const express = require('express');
const router = express.Router();
const { runValidation } = require('../validators');
const { recipeCreateValidator } = require('../validators/recipe');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const { createRecipe } = require('../controllers/recipe');

router.post(
  '/recipe',
  recipeCreateValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  createRecipe
);

module.exports = router;
