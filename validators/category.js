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
