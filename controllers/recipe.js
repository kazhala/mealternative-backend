/*
  recipe related controllers
*/

// models
const Recipe = require('../models/recipe');
const User = require('../models/user');
const Like = require('../models/like');
const ObjectId = require('mongoose').Types.ObjectId;

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
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { 'posts.recipe': recipeId } }
    );
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
  const userId = req.profile._id;
  console.log(userId, recipeId);
  try {
    let liked = await Like.findOne({
      user: userId,
      recipe: recipeId
    });
    console.log(liked);
    if (liked) {
      await Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { likes: -1 } });
      await liked.remove();
    } else {
      await Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { likes: 1 } });
      liked = new Like({
        user: userId,
        recipe: recipeId
      });
      await liked.save();
    }
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
module.exports.listSearch = async (req, res) => {
  const { query } = req;
  // default page size
  const size = query.size ? Number(query.size) : 10;
  const search = query.search;
  const page = query.page ? Number(query.page) : 1;
  // make sure to pass desc with '-' append to the front
  const orderBy = query.orderBy ? query.orderBy : '-likes';
  // skip how many entries
  const skip = (page - 1) * size;

  if (search) {
    try {
      // find base on title or description
      const response = await Recipe.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      })
        .populate('categories', 'name')
        .populate('postedBy', 'username')
        .select('-ingredients')
        .sort(orderBy)
        .limit(size)
        .skip(skip);
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

// list recipes when user enter recipe discovery page
module.exports.listRandomRecipe = async (req, res) => {
  const { query } = req;
  try {
    // get total entries to calculate total pages
    const totalEntries = await Recipe.countDocuments({});
    // default size 10
    const size = query.size ? Number(query.size) : 10;
    // calculate total page
    const totalPages = Math.ceil(totalEntries / size);
    // generate random page if first query
    const page = query.page
      ? Number(query.page)
      : Math.ceil(Math.random() * totalPages);
    // skip how many entries
    console.log(page);
    const skip = page > 0 ? (page - 1) * size : 0;
    let orderNum = Math.floor(Math.random() * 14);
    const sortArr = [
      '_id',
      'likes',
      'bookmarks',
      'rating',
      'updatedAt',
      'createdAt',
      'title',
      'description',
      '-_id',
      '-likes',
      '-bookmarks',
      '-rating',
      '-updatedAt',
      '-createdAt',
      '-title',
      '-description'
    ];
    if (query.orderBy) {
      orderNum = sortArr.indexOf(query.orderBy);
    }

    const response = await Recipe.find({})
      .populate('postedBy', 'username')
      .select('-ingredients')
      .select('-steps')
      .select('-categories')
      .sort(sortArr[orderNum])
      .limit(size)
      .skip(skip);
    return res
      .status(200)
      .json({ response, sortOption: sortArr[orderNum], page });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};
