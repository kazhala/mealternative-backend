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
  recipeRatingValidator
} = require('../validators/recipe');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  createRecipe,
  readRecipe,
  deleteRecipe,
  updateRecipe,
  updateLikes,
  listSearch,
  listRandomRecipe,
  updateRating,
  listCategoryRecipe
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

// recipe list/search
router.get('/recipes/search', listSearch);
router.get('/recipes/list', listRandomRecipe);
router.get('/recipes/category', listCategoryRecipe);

// recipe likes
router.put(
  '/recipe/likes/:recipeId',
  requireSignIn,
  authMiddleware,
  updateLikes
);
// recipe rating
router.put(
  '/recipe/rating/:recipeId',
  recipeRatingValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  updateRating
);

module.exports = router;
