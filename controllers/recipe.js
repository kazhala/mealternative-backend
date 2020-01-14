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
