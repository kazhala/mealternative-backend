const express = require('express');
const router = express.Router();
const { signUp, signIn, preSignUp, signOut } = require('../controllers/auth');
const { userSignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/pre-signup', userSignupValidator, runValidation, preSignUp);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);

module.exports = router;
