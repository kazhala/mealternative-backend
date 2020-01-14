/*
  Category controllers
*/
const Category = require('../models/category');

module.exports.createCategory = async (req, res) => {
  try {
    console.log(req.profile);
  } catch (err) {
    console.log(err);
  }
};
