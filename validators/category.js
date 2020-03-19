const { check } = require('express-validator');

module.exports.categoryCreateValidator = [
  check('name')
    .isLength({ min: 3, max: 50 })
    .withMessage('Category name is either too long or too short'),
  check('imageUrl')
    .notEmpty()
    .withMessage('Category has to have a thumbnail')
];

module.exports.categoryDeleteValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name must be specified')
];

module.exports.categoryUpdateValidator = [
  check('name')
    .notEmpty()
    .withMessage("Can't find the category to update")
];
