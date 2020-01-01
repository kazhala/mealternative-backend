const User = require('../models/user');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const { dbErrorHandler } = require('../helpers/dbHelpers');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.preSignUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(403).json({
        error: 'Username is taken'
      });
    }
    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(403).json({
        error: 'Email already exists'
      });
    }
    const token = jwt.sign(
      { username, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    );
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
      <p>Please use the following link to activate your account:</p>
      <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>https://mealternative.com</p>
    `
    };
    await sgMail.send(emailData);
    res.status(200).json({
      message: `Email has been sent to ${email}. Follow the instructions to activate your account`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Something went wrong, try again later'
    });
  }

  // const hashed_password = await bcrypt.hash(password, 10);
  // const user = new User({ username, email, hashed_password });
  // try {
  //   const response = await user.save();
  //   res.json(response);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send({
  //     message: dbErrorHandler(err)
  //   });
  // }
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
