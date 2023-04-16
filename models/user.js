// Require Mongoose
const mongoose = require('mongoose');
const mongooseConnection = require('./index');


// Define a schema
const Schema = mongoose.Schema;

const User = new Schema({
  name: { 
    type: String,
    required: true
  },
  signUpDateTime: { 
    type: Date, 
    default: Date.now(),
    required: true
  },
  password: {
   type: String,
   required: true
  },
  token : { 
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  paymentMethods: [{
    type: Boolean,
    default: false,
    required: false
  }],
  tags: {
    type: [String],
    required: false
  },
});

// Compile model from schema
const userModel = mongooseConnection.model("userModel", User);

module.exports = userModel;