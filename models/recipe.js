/*
  The recipe model
*/

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const arrayMinLength = (val) => {
  return val.length > 0;
};

const stepSchema = new mongoose.Schema({
  stepTitle: {
    type: String,
    trim: true,
    minlength: 3,
  },
  stepImageUrl: {
    type: String,
    trim: true,
  },
  stepDescriptions: {
    type: String,
    trim: true,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbImageUrl: {
      type: String,
      trim: true,
      default:
        'https://res.cloudinary.com/kazhala/image/upload/c_scale,h_1000,w_1500/v1583356356/mealternative/noimage_wclxmf.png',
    },
    categories: {
      type: [{ type: ObjectId, ref: 'Category' }],
      validate: [arrayMinLength, '{PATH} needs at least one entry'],
    },
    ingredients: [
      { type: String, trim: true, lowercase: true, maxlength: 100 },
    ],
    steps: {
      type: [stepSchema],
      validate: [arrayMinLength, '{PATH} needs at least one entry'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
