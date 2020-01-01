const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/auth');
const { userSignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/signup', userSignupValidator, runValidation, signUp);

module.exports = router;
