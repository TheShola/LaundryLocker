// Require Mongoose
const mongoose = require('mongoose');
const mongooseConnection = require('./index');

// Define a schema
const Schema = mongoose.Schema;

const Orders = new Schema({
    orderNumber: {
        type: String,
        required: true
      },
      orderDate: {
        type: Date,
        required: true,
        default: Date.now()
      },
      customerName: {
        type: String,
        required: true
      },
      customerEmail: {
        type: String,
        required: true
      },
      products: [{
        productName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }]

});

// Compile model from schema
const orderModel = mongooseConnection.model("orderModel", Orders);

module.exports = orderModel;