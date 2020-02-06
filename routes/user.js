/*
  User related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewars
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  bookmarkRecipe,
  listUserRecipe,
  readUser
} = require('../controllers/user');

// routes
router.put(
  '/user/bookmark/recipe/:recipeId',
  requireSignIn,
  authMiddleware,
  bookmarkRecipe
);

router.get('/user/:userId/recipes', listUserRecipe);

// read user infomation
router.get('/user/:userId/details', readUser);

// update detail
// TODO

module.exports = router;
