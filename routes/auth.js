const express = require('express');
const router = express.Router();
const { signUp, signIn, preSignUp } = require('../controllers/auth');
const { userSignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/pre-signup', userSignupValidator, runValidation, preSignUp);
router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
