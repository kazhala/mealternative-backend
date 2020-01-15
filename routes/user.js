/*
  User related routes
*/

const express = require('express');
const router = express.Router();
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const { starRecipe } = require('../controllers/user');

router.put(
  '/user/star/recipe/:recipeId',
  requireSignIn,
  authMiddleware,
  starRecipe
);

module.exports = router;
