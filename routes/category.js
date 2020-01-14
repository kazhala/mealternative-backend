const express = require('express');
const router = express.Router();
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignIn, adminMiddleware } = require('../controllers/auth');
const { createCategory } = require('../controllers/category');

router.post(
  '/category',
  categoryCreateValidator,
  runValidation,
  requireSignIn,
  adminMiddleware,
  createCategory
);

module.exports = router;
