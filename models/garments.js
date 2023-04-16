// Require Mongoose
const mongoose = require('mongoose');
const mongooseConnection = require('./index');
const User = require('./user');

// Define a schema
const Schema = mongoose.Schema;

const GarmentSchema = new Schema({
    user: {
        type: User,
        required: true
    },
    color: {
        type: String,
        required: true
      },
    type: {
        type: String,
        required: true,
        enum: [
            'long dress',
            'short dress',
            'trousers',
            'long skirt',
            'short skirt',
            'suit',
            'shirt',
            'top',
            'overall'],
      },
    tags: [{
        type: String,
        required: true
      }],
    brand: {
        type: String,
      },
    isDamaged: {
        type: Boolean,
        required: true,
        default: false
      },
    isStained : {
        type: Boolean,
        required: true,
        default: false
      },
    isLost : {
        type: Boolean,
        required: true,
        default: false
      }

});

// Compile model from schema
const orderModel = mongooseConnection.model("orderModel", Orders);

module.exports = orderModel;