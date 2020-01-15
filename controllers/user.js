const User = require('../models/user');
const Recipe = require('../models/recipe');
const mongoose = require('mongoose');

module.exports.starRecipe = async (req, res) => {
  const recipeId = mongoose.Types.ObjectId(req.params.recipeId);
  const userId = req.profile._id;
  try {
    const user = await User.findOne({ _id: userId });
    const idIndex = user.stars.recipe.indexOf(recipeId);
    if (idIndex === -1) {
      user.stars.recipe.push(recipeId);
    } else {
      user.stars.recipe.splice(idIndex, 1);
    }
    await user.save();
    return res.status(200).json({
      message: 'Success star'
    });
  } catch (err) {
    console.log(err);
  }
};
