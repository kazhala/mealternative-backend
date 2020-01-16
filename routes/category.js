/*
  Category related routes
*/

// express
const express = require('express');
const router = express.Router();

// middlewares and controllers
const { runValidation } = require('../validators');
const {
  categoryCreateValidator,
  categoryDeleteValidator,
  categoryUpdateValidator
} = require('../validators/category');
const { requireSignIn, adminMiddleware } = require('../controllers/auth');
const {
  createCategory,
  listCategory,
  deleteCategory,
  updateCategory,
  listRecipesByCategory
} = require('../controllers/category');

// routes
// CRUD
router.post(
  '/category',
  categoryCreateValidator,
  runValidation,
  requireSignIn,
  adminMiddleware,
  createCategory
);
router.get('/categories', listCategory);
router.delete(
  '/category',
  categoryDeleteValidator,
  runValidation,
  requireSignIn,
  adminMiddleware,
  deleteCategory
);
router.put(
  '/category',
  categoryUpdateValidator,
  runValidation,
  requireSignIn,
  adminMiddleware,
  updateCategory
);

// list all recipes in a category
router.get('/category/:categoryId/recipes', listRecipesByCategory);

module.exports = router;
