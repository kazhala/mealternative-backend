const { check } = require('express-validator');

module.exports.recipeCreateValidator = [
  check('title')
    .isLength({ min: 3, max: 60 })
    .withMessage('Title needs to be between 3-60 characters'),
  check('description')
    .isLength({ max: 1000 })
    .withMessage("Description can't be longer than 1000"),
  check('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category should be selected'),
  check('ingredients')
    .isLength({ max: 30 })
    .withMessage('Length should not exceeds 30'),
  check('steps')
    .isArray({ min: 1 })
    .withMessage('Should have at least one step'),
  check('steps.*.stepTitle')
    .isLength({ min: 3, max: 60 })
    .withMessage('Each step title should be within 3 and 60'),
  check('steps.*.stepDescriptions')
    .isLength({ max: 1000 })
    .withMessage('Step description should be less than 1000')
];

module.exports.recipeUpdateValidator = [
  check('thumbImageUrl')
    .isURL()
    .withMessage("Can't resolve the thumbnail image url"),
  check('title')
    .isLength({ min: 3, max: 60 })
    .withMessage('Title needs to be between 3-60 characters'),
  check('description')
    .isLength({ max: 1000 })
    .withMessage("Description can't be longer than 1000"),
  check('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category should be selected'),
  check('ingredients')
    .isLength({ max: 30 })
    .withMessage('Length should not exceeds 30'),
  check('steps')
    .isArray({ min: 1 })
    .withMessage('Should have at least one step'),
  check('steps.*.stepTitle')
    .isLength({ min: 3, max: 60 })
    .withMessage('Each step title should be within 3 and 60'),
  check('steps.*.stepDescriptions')
    .isLength({ max: 1000 })
    .withMessage('Step description should be less than 1000')
];

module.exports.recipeLikeValidator = [
  check('type')
    .notEmpty()
    .isIn([1, -1])
    .withMessage('Please specify 1 or -1 for increment or decrement')
];
