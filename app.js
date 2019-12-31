/*
  Server code running backend apis
*/
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

// routes
const userRoutes = require('./routes/user');

// main app running express
const app = express();

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
