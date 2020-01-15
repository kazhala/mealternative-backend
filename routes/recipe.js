/*
  recipe route
*/

// express
const express = require('express');
const router = express.Router();
const { runValidation } = require('../validators');
const {
  recipeCreateValidator,
  recipeUpdateValidator
} = require('../validators/recipe');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  createRecipe,
  readRecipe,
  deleteRecipe,
  updateRecipe
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
router.put(
  '/recipe/:recipeId',
  recipeUpdateValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  updateRecipe
);

module.exports = router;
