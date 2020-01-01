const User = require('../models/user');
const bcrypt = require('bcrypt');
const { dbErrorHandler } = require('../helpers/dbHelpers');

module.exports.signUp = async (req, res) => {
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
