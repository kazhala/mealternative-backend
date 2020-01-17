/*
  recipe related controllers
*/

// models
const Recipe = require('../models/recipe');
const User = require('../models/user');

// create recipe
module.exports.createRecipe = async (req, res) => {
  const {
    title,
    description,
    thumbImageUrl,
    categories,
    ingredients,
    steps
  } = req.body;
  const userId = req.profile._id;
  // create mongoose object
  const recipe = new Recipe({
    title,
    description,
    thumbImageUrl: thumbImageUrl ? thumbImageUrl : undefined,
    categories,
    ingredients,
    steps,
    postedBy: userId
  });

  try {
    // push the recipe id to user.posts
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { 'posts.recipe': recipe._id } }
    );
    // save the record
    await recipe.save();
    return res.status(200).json({
      message: 'Recipe created successfully'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// retrieve a recipe
module.exports.readRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const recipe = await Recipe.findOne({ _id: recipeId });
    if (recipe) {
      return res.status(200).json(recipe);
    } else {
      return res.status(404).json({
        error: 'Did not find the matching recipe'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// delete recipe
module.exports.deleteRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.profile._id;
  try {
    // match both to remove (needs to belong to the owner)
    const response = await Recipe.findOneAndRemove({
      _id: recipeId,
      postedBy: userId
    });
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({
        error: 'Did not find the recipe'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// update recipe
module.exports.updateRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.profile._id;
  const {
    title,
    description,
    thumbImageUrl,
    categories,
    ingredients,
    steps
  } = req.body;
  // create the newRecipe params
  const newRecipe = {
    title,
    description,
    thumbImageUrl,
    categories,
    ingredients,
    steps,
    postedBy: userId
  };

  try {
    // update the document and return the new one
    const response = await Recipe.findOneAndUpdate(
      { _id: recipeId, postedBy: userId },
      newRecipe,
      { new: true }
    );
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({
        error: 'Recipe not found'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// increment/decrement the likes
module.exports.updateLikes = async (req, res) => {
  const recipeId = req.params.recipeId;
  // type = [1, -1]
  const { type } = req.body;
  try {
    await Recipe.findOneAndUpdate(
      { _id: recipeId },
      { $inc: { likes: Number(type) } }
    );
    return res.status(200).json({
      message: 'Success increment likes'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// list recipes based on user search
// TODO: add pagination
module.exports.listSearch = async (req, res) => {
  const { search } = req.query;
  if (search) {
    try {
      // find base on title or description
      const response = await Recipe.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }).select('-ingredients');
      return res.status(200).json(response);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Something went wrong..'
      });
    }
  } else {
    // if no search, return error, clientSide should prevent it
    return res.status(400).json({
      error: 'Please enter a search string'
    });
  }
};
