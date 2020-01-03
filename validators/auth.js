const { check } = require('express-validator');

module.exports.preSignupValidator = [
  check('username')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

module.exports.signUpValidator = [
  check('token')
    .isJWT()
    .withMessage('Could not find the token, please sign up again')
];

module.exports.signInValidator = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address')
];

module.exports.forgotPasswordValidator = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address')
];

module.exports.resetPasswordValidator = [
  check('passwordResetToken')
    .isJWT()
    .withMessage('Token invalid, please try again'),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];
