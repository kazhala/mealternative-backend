const User = require('../models/user');

module.exports.signUp = async (req, res) => {
  const { username, email } = req.body;
  const user = new User({ username, email });
  try {
    const response = user.save();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};
