/*
  The recipe model
*/

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const stepSchema = new mongoose.Schema({
  stepTitle: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 60
  },
  stepImageUrl: {
    type: String,
    trim: true,
    lowercase: true
  },
  tip: {
    type: String,
    trim: true,
    maxlength: 60
  }
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 60,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    thumbImageUrl: {
      type: String,
      trim: true,
      default:
        'https://res.cloudinary.com/kazhala/image/upload/v1578954595/mealternative/noimage_jo5klk.png',
      lowercase: true
    },
    categories: {
      type: [{ type: ObjectId, ref: 'Category' }],
      validate: [arrayMinLength, '{PATH} needs at least one entry']
    },
    ingredients: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
    steps: {
      type: [stepSchema],
      validate: [arrayMinLength, '{PATH} needs at least one entry']
    },
    likes: {
      type: Number,
      default: 0
    },
    stars: {
      type: Number,
      default: 0
    },
    postedBy: {
      type: ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const arrayMinLength = val => {
  return val.length > 0;
};

module.exports = mongoose.module('Recipe', recipeSchema);
