const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/auth');
const { userSignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/signup', userSignupValidator, runValidation, signUp);
router.post('/signin', signIn);

module.exports = router;
