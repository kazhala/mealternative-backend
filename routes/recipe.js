/*
  recipe route
*/

// express
const express = require('express');
const router = express.Router();
const { runValidation } = require('../validators');
const { recipeCreateValidator } = require('../validators/recipe');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  createRecipe,
  readRecipe,
  deleteRecipe
} = require('../controllers/recipe');

router.post(
  '/recipe',
  recipeCreateValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  createRecipe
);
router.get('/recipe/:recipeId', readRecipe);
router.delete('/recipe/:recipeId', requireSignIn, authMiddleware, deleteRecipe);

module.exports = router;
