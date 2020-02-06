/*
  User related controllers
*/

// model
const User = require('../models/user');
const Recipe = require('../models/recipe');
const Bookmark = require('../models/bookmark');

// bookmark a recipe
module.exports.bookmarkRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.profile._id;
  try {
    let bookmarked = await Bookmark.findOne({ user: userId, recipe: recipeId });
    if (bookmarked) {
      await bookmarked.remove();
      await Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { bookmarks: -1 } }
      );
    } else {
      bookmarked = new Bookmark({
        user: userId,
        recipe: recipeId
      });
      await bookmarked.save();
      await Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { bookmarks: 1 } }
      );
    }
    return res.status(200).json({
      message: 'Success bookmark'
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

// retrieve user details
module.exports.readUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId }).select('-role');
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log('Error', err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};
