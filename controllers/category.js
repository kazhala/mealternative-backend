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
