const { check } = require('express-validator');

module.exports.recipeCreateValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('Title needs to be at least 3 characters'),
  check('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category should be selected'),
  check('ingredients')
    .isLength({ max: 100 })
    .withMessage('Length should not exceeds 30'),
  check('steps')
    .isArray({ min: 1 })
    .withMessage('Should have at least one step'),
  check('steps.*.stepTitle')
    .isLength({ min: 3 })
    .withMessage('Each step title should be at least 3 characters'),
];

module.exports.recipeUpdateValidator = [
  check('thumbImageUrl')
    .isURL()
    .withMessage("Can't resolve the thumbnail image url"),
  check('title')
    .isLength({ min: 3 })
    .withMessage('Title needs to be at least 3 characters'),
  check('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category should be selected'),
  check('ingredients')
    .isLength({ max: 100 })
    .withMessage('Length should not exceeds 100'),
  check('steps')
    .isArray({ min: 1 })
    .withMessage('Should have at least one step'),
  check('steps.*.stepTitle')
    .isLength({ min: 3 })
    .withMessage('Each step title should be at least 3 characters'),
];

module.exports.recipeRatingValidator = [
  check('rating').isNumeric().withMessage('Must enter a rating number'),
];
