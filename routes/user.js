/*
  User related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewars
const { runValidation } = require('../validators');
const { userUpdateValidator } = require('../validators/user');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  bookmarkRecipe,
  listUserRecipe,
  readUser,
  listUserBookmarks,
  updateUser
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

// list user bookmarks
router.get(
  '/user/:userId/bookmarks',
  requireSignIn,
  authMiddleware,
  listUserBookmarks
);

// update user information
router.put(
  '/user/:userId/details',
  userUpdateValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  updateUser
);

// update detail
// TODO

module.exports = router;
