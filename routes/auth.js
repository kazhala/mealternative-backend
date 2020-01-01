const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/auth');

router.post('/signup', signUp);

module.exports = router;
