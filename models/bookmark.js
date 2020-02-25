/*
  bookmark model
  store all user bookmarks
*/

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User'
    },
    recipe: {
      type: ObjectId,
      ref: 'Recipe'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
