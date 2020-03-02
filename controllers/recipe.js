/*
  recipe related controllers
*/

// models
const Recipe = require('../models/recipe');
const Like = require('../models/like');
const Bookmark = require('../models/bookmark');
const Rating = require('../models/rating');
const Category = require('../models/category');

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
  const { userId } = req.query;
  try {
    const recipe = await Recipe.findOne({ _id: recipeId })
      .populate('categories', 'name')
      .populate('postedBy', 'username photoUrl');
    if (recipe) {
      if (userId) {
        const liked = await Like.findOne({ user: userId, recipe: recipeId });
        const booked = await Bookmark.findOne({
          user: userId,
          recipe: recipeId
        });
        const responseData = {
          ...recipe._doc,
          liked: Boolean(liked),
          booked: Boolean(booked)
        };
        return res.status(200).json(responseData);
      }
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
      await Bookmark.deleteMany({ recipe: recipeId });
      await Like.deleteMany({ recipe: recipeId });
      await Rating.deleteMany({ recipe: recipeId });
      return res.status(200).json({
        message: 'Delete success'
      });
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
      await liked.remove();
      await Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { likes: -1 } });
      return res.status(200).json({
        message: 'You just canceled like for this post'
      });
    } else {
      liked = new Like({
        user: userId,
        recipe: recipeId
      });
      await liked.save();
      await Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { likes: 1 } });
      return res.status(200).json({
        message: 'You just liked this recipe'
      });
    }
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
      const totalEntries = await Recipe.count({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
      const totalPages = Math.ceil(totalEntries / size);
      // find base on title or description
      const response = await Recipe.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      })
        .populate('categories', 'name')
        .populate('postedBy', 'username photoUrl')
        .select('-ingredients')
        .sort(orderBy)
        .limit(size)
        .skip(skip);
      return res
        .status(200)
        .json({ response, page, sortOption: orderBy, totalPages, size });
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
    console.log('size', size);
    // calculate total page
    const totalPages = Math.ceil(totalEntries / size);
    // generate random page if first query
    let page;
    if (totalPages === 1) {
      page = 1;
    } else {
      page = query.page
        ? Number(query.page)
        : Math.ceil(Math.random() * (totalPages - 1));
    }
    // skip how many entries
    console.log(page);
    const skip = page > 0 ? (page - 1) * size : 0;
    let orderNum = Math.floor(Math.random() * 13);
    const sortArr = [
      '_id',
      '-likes',
      '-bookmarks',
      '-rating',
      'updatedAt',
      'createdAt',
      'title',
      'description',
      '-_id',
      '-updatedAt',
      '-createdAt',
      '-title',
      '-description'
    ];
    if (query.orderBy) {
      orderNum = sortArr.indexOf(query.orderBy);
    }

    const response = await Recipe.find({})
      .populate('postedBy', 'username photoUrl')
      .select('-ingredients')
      .select('-steps')
      .select('-categories')
      .sort(sortArr[orderNum])
      .collation({ locale: 'en' })
      .limit(size)
      .skip(skip);
    return res.status(200).json({
      response,
      sortOption: sortArr[orderNum],
      page,
      totalPages,
      size
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// update rating
module.exports.updateRating = async (req, res) => {
  const userId = req.profile._id;
  const recipeId = req.params.recipeId;
  const { rating } = req.body;

  try {
    const existingRate = await Rating.findOne({
      user: userId,
      recipe: recipeId
    });
    if (existingRate) {
      existingRate.rating = rating;
      await existingRate.save();
    } else {
      const newRating = new Rating({
        user: userId,
        recipe: recipeId,
        rating
      });
      await newRating.save();
    }
    const allRatings = await Rating.find({ recipe: recipeId });

    let totalRatings = 0;
    allRatings.forEach(rateRecord => {
      totalRatings = totalRatings + rateRecord.rating;
    });
    const averageRating = totalRatings / allRatings.length;
    await Recipe.findOneAndUpdate({ _id: recipeId }, { rating: averageRating });
    return res.status(200).json({
      message: 'Success update rating'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};

// list category recipes
module.exports.listCategoryRecipe = async (req, res) => {
  const { query } = req;
  const categoryId = query.id;
  const page = query.page ? Number(query.page) : 1;
  const size = query.size ? Number(query.size) : 10;
  const skip = (page - 1) * size;
  const sort = query.sort ? query.sort : '-rating';
  const totalDocuments = await Recipe.count({ categories: categoryId });
  const totalPages = Math.ceil(totalDocuments / size);
  if (!categoryId) {
    return res.status(404).json({
      error: 'Missing categoryid'
    });
  }
  try {
    const recipes = await Recipe.find({ categories: categoryId })
      .limit(size)
      .skip(skip)
      .populate('postedBy', 'username photoUrl')
      .select('-ingredients')
      .sort(sort);
    const category = await Category.findOne({ _id: categoryId });
    const responseData = {
      recipes,
      page,
      category,
      totalPages,
      size
    };
    return res.status(200).json(responseData);
  } catch (err) {
    console.log('Error', err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};
