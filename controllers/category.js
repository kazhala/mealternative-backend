/*
  Category controllers
*/
const Category = require('../models/category');

module.exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let category = new Category({ name });
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

module.exports.listCategory = async (req, res) => {
  try {
    const list = await Category.find({});
    return res.status(200).json(list);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await Category.findOneAndDelete({ name });
    return res.status(200).json({
      message: 'Category delete successfully'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};
