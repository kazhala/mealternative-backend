const { check } = require('express-validator');

module.exports.userUpdateValidator = [
  check('username')
    .notEmpty()
    .withMessage('Username is required'),
  check('about')
    .isLength({ max: 1000 })
    .withMessage("About can't be longer than 1000"),
  check('photoUrl')
    .notEmpty()
    .withMessage('PhotoUrl is required')
];
