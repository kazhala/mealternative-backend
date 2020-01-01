const User = require('../models/user');
const bcrypt = require('bcrypt');
const { dbErrorHandler } = require('../helpers/dbHelpers');

module.exports.preSignUp = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed_password = await bcrypt.hash(password, 10);
  const user = new User({ username, email, hashed_password });
  try {
    const response = await user.save();
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: dbErrorHandler(err)
    });
  }
};

module.exports.signUp = async (req, res) => {};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+hashed_password');
    if (user) {
      const passwordMatch = await bcrypt.compare(
        password,
        user.hashed_password
      );
      if (passwordMatch) {
        res.status(200).json({
          message: `Welcome back ${user.username}`
        });
      } else {
        res.status(401).json({
          message: 'Password does not match'
        });
      }
    } else {
      res.status(404).json({
        message: 'Email does not exist'
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: dbErrorHandler(err)
    });
  }
};
