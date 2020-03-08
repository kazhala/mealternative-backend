/*
  Auth route controller
*/

// model
const User = require('../models/user');
// package
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const md5 = require('md5');

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
      <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
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
    // would be internet error if this catches error
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
  try {
    // verify the token
    let decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    const { username, email, password } = decoded;
    const hashed_password = await bcrypt.hash(password, 10);
    const photoUrl = `https://www.gravatar.com/avatar/${md5(
      email
    )}?d=identicon`;
    const user = new User({ username, email, hashed_password, photoUrl });
    await user.save();
    res.status(200).json({
      message: 'Sign Up success, please sign in'
    });
  } catch (err) {
    // would be invalid token if it catches any error
    console.log(err);
    res.status(422).json({
      error: 'Token is invalid, please sign up again'
    });
  }
};

// presignin to check if it comes from signup-autosignin or normal signin
// middleware
module.exports.preSignIn = async (req, res, next) => {
  const { token, email, password } = req.body;
  console.log(token);
  if (email || password) {
    next();
  } else {
    try {
      let decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
      const { email, password } = decoded;
      req.body.email = email;
      req.body.password = password;
      next();
    } catch (err) {
      console.log(err);
      res.status(422).json({
        error: 'Auto sign in failed, please sign in manually'
      });
    }
  }
};

// sign in user
module.exports.signIn = async (req, res) => {
  // TODO: remove below temp update
  // await User.updateMany({}, { posts: { recipe: [] } });
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
        const { _id, username, email, role, photoUrl } = user;
        // 7 day expiry date
        const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });
        // TODO: check if we acutally need cookie-parser package at backend
        res.cookie('token', token, { expiresIn: '7d' });
        res.status(200).json({
          token,
          user: { _id, username, email, role, photoUrl }
        });
      } else {
        res.status(401).json({
          error: 'Password does not match'
        });
      }
    } else {
      res.status(404).json({
        error: 'Email does not exist'
      });
    }
  } catch (err) {
    // catch internet error
    console.log(err);
    res.status(500).send({
      error: 'Something went wrong, please try again later'
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

// handle forgot password
module.exports.forgotPassword = async (req, res) => {
  // frontend need to pass email to chanage password
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'Email does not exist'
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m'
    });

    // prepare email data
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

    // store the token into user database temporarily
    await user.updateOne({ passwordResetToken: token });
    await sgMail.send(emailData);
    return res.status(200).json({
      message: `Reset link has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 mins`
    });
  } catch (err) {
    // internet error
    console.log(err);
    res.status(500).json({
      error: 'Something went wrong, try again later'
    });
  }
};

// the actual reset password backend handler
module.exports.resetPassword = async (req, res) => {
  // get the token and new password from frontend
  const { passwordResetToken, newPassword } = req.body;
  try {
    let decoded = jwt.verify(
      passwordResetToken,
      process.env.JWT_RESET_PASSWORD
    );

    // get the user with token field
    let user = await User.findOne({ _id: decoded._id }).select(
      '+passwordResetToken'
    );
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    // if both token match and valid, change password
    if (user.passwordResetToken === passwordResetToken) {
      const newHashed_password = await bcrypt.hash(newPassword, 10);
      user.hashed_password = newHashed_password;
      user.passwordResetToken = '';
      await user.save();
      res.status(200).json({
        message: 'Password reset success'
      });
    } else {
      res.status(400).json({
        error: 'Something went wrong, try again later'
      });
    }
  } catch (err) {
    // internet error or token invalid
    console.log(err);
    res.status(422).json({
      error: 'Token is invalid, please try again'
    });
  }
};

// expressJWT package to validate token and append user id to req.body
module.exports.requireSignIn = expressJWT({
  secret: process.env.JWT_SECRET
});

// check if user is admin
module.exports.adminMiddleware = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const resUser = await User.findOne({ _id: userId });
    if (!resUser) return res.status(404).json({ error: 'User not found' });
    if (resUser.role === 1) {
      req.profile = resUser;
      next();
    } else {
      return res.status(401).json({ error: 'Admin resource. Access denied' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// check if user exists
module.exports.authMiddleware = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const resUser = await User.findOne({ _id: userId });
    if (resUser) {
      req.profile = resUser;
      next();
    } else {
      return res.status(404).json({
        error: 'User not found'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};
