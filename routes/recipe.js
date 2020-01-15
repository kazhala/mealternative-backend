/*
  recipe route
*/

// express
const express = require('express');
const router = express.Router();

// middleware
const { runValidation } = require('../validators');
const {
  recipeCreateValidator,
  recipeUpdateValidator,
  recipeLikeValidator
} = require('../validators/recipe');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  createRecipe,
  readRecipe,
  deleteRecipe,
  updateRecipe,
  updateLikes
} = require('../controllers/recipe');

// recipe crud
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

// recipe star and likes
router.put(
  '/recipe/likes/:recipeId',
  recipeLikeValidator,
  runValidation,
  updateLikes
);

module.exports = router;
