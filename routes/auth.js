const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  preSignUp,
  signOut,
  forgotPassword
} = require('../controllers/auth');
const {
  preSignupValidator,
  signUpValidator,
  signInValidator,
  forgotPasswordValidator
} = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/pre-signup', preSignupValidator, runValidation, preSignUp);
router.post('/signup', signUpValidator, runValidation, signUp);
router.post('/signin', signInValidator, runValidation, signIn);
router.get('/signout', signOut);
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

module.exports = router;
