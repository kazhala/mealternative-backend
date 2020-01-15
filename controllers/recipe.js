/*
  recipe related controllers
*/
const Recipe = require('../models/recipe');

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

module.exports.deleteRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.profile._id;
  try {
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

module.exports.updateLikes = async (req, res) => {
  const recipeId = req.params.recipeId;
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
