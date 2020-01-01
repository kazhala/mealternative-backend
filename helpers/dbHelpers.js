const mongoose = require('mongoose');

module.exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('Databse connected');
  } catch (err) {
    console.log(err);
  }
};

module.exports.dbErrorHandler = error => {
  let message = '';
  const { errmsg, code } = error;
  switch (code) {
    case 11000:
      message = getErrorMessage(errmsg);
      break;
    case 11001:
      console.log(error);
      message = errmsg;
      break;
    default:
      console.log(error);
      message = errmsg;
      break;
  }
  return message;
};

const getErrorMessage = errmsg => {
  let output;
  try {
    let fieldName = errmsg.substring(
      errmsg.lastIndexOf('.$') + 2,
      errmsg.lastIndexOf('_1')
    );
    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exits';
  } catch (err) {
    output = 'Unique field already exists';
  }
  return output;
};
