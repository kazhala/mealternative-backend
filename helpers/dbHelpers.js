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

module.exports.testDb = () => {
  console.log('test');
};
