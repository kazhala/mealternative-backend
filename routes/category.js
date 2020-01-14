const express = require('express');
const router = express.Router();
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
  updateCategory
} = require('../controllers/category');

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

module.exports = router;
