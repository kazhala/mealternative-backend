const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('Databse connected');
  } catch (err) {
    console.log(err);
  }
};

module.exports.connectDb = connectDb;
