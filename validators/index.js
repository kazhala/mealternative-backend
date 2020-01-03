/*
  Run the validation, if no runValidation, validator would not work
*/
const { validationResult } = require('express-validator');

module.exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};
