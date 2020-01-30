/*
  rating model
  for calculating the avaerage of the rating
*/

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ratingSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  recipe: {
    type: ObjectId,
    ref: 'Recipe'
  },
  rating: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
