/*
  Server code running backend apis
*/
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const { connectDb } = require('./helpers/dbHelpers');

// routes
const userRoutes = require('./routes/user');

// initialise main app running express
const app = express();

// connect to database
connectDb();

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// app routes
app.use('/api', userRoutes);

// port for running the apis
const port = process.env.PORT;
// listen to the port
app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
