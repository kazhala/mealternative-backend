/*
  Auth route controller
*/

// model
const User = require('../models/user');
// package
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
// helper
// const { dbErrorHandler } = require('../helpers/dbHelpers');

// set sendGrid api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sign up first step (send email)
module.exports.preSignUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check if username exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(403).json({
        error: 'Username is taken'
      });
    }
    // check if email exists
    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(403).json({
        error: 'Email already exists'
      });
    }

    // generate jwt token for account activation
    const token = jwt.sign(
      { username, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    );
    // prepare email data
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
};

// activate the account on user click link
module.exports.signUp = async (req, res) => {
  // get token from body sent by client side
  const token = req.body.token;
  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
      const { username, email, password } = decoded;
      const hashed_password = await bcrypt.hash(password, 10);
      const user = new User({ username, email, hashed_password });
      await user.save();
      res.status(200).json({
        message: 'Sign Up success, please sign in'
      });
    } catch (err) {
      console.log(err);
      res.status(422).json({
        error: 'Token is invalid, please sign up again'
      });
    }
  } else {
    res.status(404).json({
      error: 'Could not find the token, please sign up again'
    });
  }
};

// sign in user
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    // get user, get password (default won't return password)
    const user = await User.findOne({ email }).select('+hashed_password');
    if (user) {
      // compare if hashed_password is match with user input
      const passwordMatch = await bcrypt.compare(
        password,
        user.hashed_password
      );
      if (passwordMatch) {
        console.log(user);
        const { _id, username, email, role } = user;
        const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });
        res.cookie('token', token, { expiresIn: '7d' });
        res.status(200).json({
          token,
          user: { _id, username, email, role }
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
      message: 'Something went wrong, please try again later'
    });
  }
};

// sign out the user
module.exports.signOut = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'Signout success'
  });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m'
    });
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password reset link',
      html: `
        <p>Please use the following link to reset your password:</p>
        <p>${process.env.CLIENT_URL}/auth/password-reset/${token}</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>https://mealternative.com</p>
      `
    };
    await user.updateOne({ resetPasswordLink: token });
    await sgMail.send(emailData);
    return res.status(200).json({
      message: `Reset link has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 mins`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Something went wrong, try again later'
    });
  }
};
