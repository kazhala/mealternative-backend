/*
  Category controllers
*/
const Category = require('../models/category');
const Recipe = require('../models/recipe');

// create
module.exports.createCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    let category = new Category({ name, imageUrl });
    await category.save();
    return res.status(200).json({
      message: 'Category successfully created'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
};

// list
module.exports.listCategory = async (req, res) => {
  try {
    const list = await Category.find({});
    return res.status(200).json(list);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
};

// delete
module.exports.deleteCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const response = await Category.findOneAndDelete({ name });
    // does not exist
    if (!response)
      return res.status(404).json({
        error: 'Category you are trying to delete does not exist'
      });
    return res.status(200).json({
      message: 'Category delete successfully'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
};

// update
module.exports.updateCategory = async (req, res) => {
  try {
    const { name, newName, imageUrl } = req.body;
    const category = await Category.findOne({ name });
    // does not exist
    if (!category)
      return res.status(404).json({
        error: 'Category you are trying to update does not exist'
      });

    category.name = newName ? newName : name;
    category.imageUrl = imageUrl ? imageUrl : category.imageUrl;
    await category.save();

    return res.status(200).json({
      message: 'Category updated successfully'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
};

// list all recipes within category
module.exports.listRecipesByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const orderBy = req.query.orderBy ? req.query.orderBy : '-likes';
  const size = req.query.size ? Number(req.query.size) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const skip = (page - 1) * size;
  const search = req.query.search;
  try {
    if (!search) {
      // mongoose is smart enough to find in array
      const response = await Recipe.find({ categories: categoryId })
        .populate('postedBy', 'username')
        .select('-ingredients')
        .sort(orderBy)
        .limit(size)
        .skip(skip);
      return res.status(200).json(response);
    } else {
      const response = await Recipe.find({
        categories: categoryId,
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
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong..'
    });
  }
};
