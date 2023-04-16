// Import the mongoose module
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', false);

// Define the database URL to connect to.
const mongoDB = process.env.MONGO_URI;

// Wait for database to connect, logging an error if there is a problem 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongoose Connected Successfully!');
  })
  .catch((error) => {
    console.log('Mongoose Connection Error:', error);
  });

module.exports = mongoose.connection;