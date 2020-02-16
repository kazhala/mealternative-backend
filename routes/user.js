/*
  User related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewars
const { runValidation } = require('../validators');
const {
  userUpdateValidator,
  userPasswordValidator
} = require('../validators/user');
const { requireSignIn, authMiddleware } = require('../controllers/auth');
const {
  bookmarkRecipe,
  listUserRecipe,
  readUser,
  listUserBookmarks,
  updateUser,
  updatePassword,
  checkNameExist
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
router.get('/user/:userId/bookmarks', listUserBookmarks);

// update user information
router.get('/user/check/:userId/:username', checkNameExist);
router.put(
  '/user/:userId/details',
  userUpdateValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  updateUser
);
router.put(
  '/user/:userId/password',
  userPasswordValidator,
  runValidation,
  requireSignIn,
  authMiddleware,
  updatePassword
);

module.exports = router;
