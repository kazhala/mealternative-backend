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

module.exports.userPasswordValidator = [
  check('oldPassword')
    .notEmpty()
    .withMessage('Please enter your old password'),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password need to be at least 6 characters long')
];
