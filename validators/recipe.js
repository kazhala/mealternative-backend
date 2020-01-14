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
    .withMessage('Should have at least one step')
];
