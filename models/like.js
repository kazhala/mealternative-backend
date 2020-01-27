/*
  like model
  store all likes
*/

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const likeSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  recipe: {
    type: ObjectId,
    ref: 'Recipe'
  }
});

module.exports = mongoose.model('Like', likeSchema);
