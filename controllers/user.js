/*
  User related controllers
*/

// model
const User = require('../models/user');
const Recipe = require('../models/recipe');
// package
const mongoose = require('mongoose');

// star a recipe
module.exports.starRecipe = async (req, res) => {
  // convert to a mongoose Id for compare
  // TODO: may remove it
  const recipeId = mongoose.Types.ObjectId(req.params.recipeId);
  const userId = req.profile._id;
  try {
    const user = await User.findOne({ _id: userId });
    const idIndex = user.stars.recipe.indexOf(recipeId);
    // if not exists, push, if exists, pop
    if (idIndex === -1) {
      user.stars.recipe.push(recipeId);
    } else {
      user.stars.recipe.splice(idIndex, 1);
    }
    // save the user
    await user.save();
    return res.status(200).json({
      message: 'Success star'
    });
  } catch (err) {
    console.log(err);
  }
};

// list all recipes based on userId
module.exports.listUserRecipe = async (req, res) => {
  const userId = req.params.userId;
  const orderBy = req.query.orderBy ? req.query.orderBy : '-createdAt';
  const size = req.query.size ? Number(req.query.size) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const skip = (page - 1) * size;
  const search = req.query.search;
  try {
    if (!search) {
      const response = await Recipe.find({ postedBy: userId })
        .select('-ingredients')
        .populate('categories', 'name')
        .sort(orderBy)
        .limit(size)
        .skip(skip);
      return res.status(200).json(response);
    } else {
      const response = await Recipe.find({
        postedBy: userId,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      })
        .select('-ingredients')
        .populate('categories', 'name')
        .sort(orderBy)
        .limit(size)
        .skip(skip);
      return res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};
