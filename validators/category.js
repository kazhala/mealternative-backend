const { check } = require('express-validator');

module.exports.categoryCreateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Category name must be specified')
];

module.exports.categoryDeleteValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name must be specified')
];

module.exports.categoryUpdateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Category name must be specified'),
  check('oldName')
    .not()
    .isEmpty()
    .withMessage("Can't find the category to update")
];
