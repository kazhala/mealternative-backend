/*
  User related controllers
*/

// model
const User = require('../models/user');
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
