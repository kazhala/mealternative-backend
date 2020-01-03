/*
  The user schema, used for signup process
*/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    max: 32,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true
  },
  hashed_password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: Number,
    default: 0
  },
  photoUrl: {
    type: String
  },
  about: {
    type: String
  },
  resetPasswordLink: {
    type: String,
    default: '',
    selec: false
  }
});

module.exports = mongoose.model('User', userSchema);
