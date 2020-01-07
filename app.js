/*
  Server code running backend apis
*/
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { connectDb } = require('./helpers/dbHelpers');

// routes
const authRoutes = require('./routes/auth');

// initialise main app running express
const app = express();

// connect to database
connectDb();

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// if (process.env.NODE_ENV === 'development') {
//   app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }
app.use(cors());

// app routes
app.use('/api', authRoutes);

// port for running the apis
const port = process.env.PORT;
// listen to the port
app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
