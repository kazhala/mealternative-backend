/*
  Category controllers
*/
const Category = require('../models/category');

// create
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

// list
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
      message: 'Something went wrong'
    });
  }
};

// update
module.exports.updateCategory = async (req, res) => {
  try {
    const { name, oldName } = req.body;
    const response = await Category.findOneAndUpdate(
      { name: oldName },
      { $set: { name: name } }
    );
    // does not exist
    if (!response)
      return res.status(404).json({
        error: 'Category you are trying to update does not exist'
      });
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
