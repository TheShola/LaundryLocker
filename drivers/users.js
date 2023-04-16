var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const {body, validationResult} = require('express-validator');

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port:587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  
  // FUNCTIONS
  /*
  HASH PASSWORD
  */
  async function hashPassword(password) {
    try {
      // Generate salt
      const salt = await bcrypt.genSalt(10);
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, salt);
  
      return hashedPassword;
    } catch (error) {
      console.error(error);
    }
  }
  
  /*
  SEND EMAIL VERFICATION
  */
  async function sendVerificationEmail(email, token) {
    try {
      // Create email message
      const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email address',
        text: `Click this link to verify your email address: <http://localhost:3000/verify?token=${token}`
      };
  
      // Send email
      const info = await transporter.sendMail(message);
      console.log('Verification email sent:', info.messageId);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * FIND USER BY EMAIL
   */

  async function findUserByEmail(email){
    const user = await User.findOne({email: email});
    if(user){
        return user;
    }
    return null;
  }
  
  module.exports = { findUserByEmail, hashPassword, sendVerificationEmail };