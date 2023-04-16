var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../../models/user');
var RequestValidator = require('request-validator-js');
const userDriver = require('../../drivers/users');
const middlewareAuth = require('../../middleware/auth');


// Use body-parser middleware
router.use(express.json());


/*
******
ROUTES
******
*/

/* Sign Up Route */
router.post('/signup', async(req,res) => {
  try {
     // Validate request
    const validator = new RequestValidator.RequestValidator();
    const errors = validator.validate(req.body, {
      'name':'required|string',
      'email': 'required|email',
      'password': 'required|min:6|string',
      'phoneNumber': 'required|min:10|string'
    });
    if(errors.length > 0) {
      return res.status(400).send({
        status: 400,
        message: errors
      });
    }

   //Check if user already exists
    const existingUser = await userDriver.findUserByEmail(req.body.email);
    if(existingUser) {
      return res.status(409).send({
        status: 409,
        message: 'User already exists'
      });
    }
    // Hash password
    const hashedPassword = await userDriver.hashPassword(req.body.password);

    // Create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber
    });

    // Save user to database
    await user.save();

    //Generate Token
    // const token = await userDriver.generateToken(user._id);

    // //Send Verification email

    // const message = await userDriver.sendVerificationEmail(req.body.email, token);
    // if(!message) {
    //   return res.status(500).send({
    //     status: 500,
    //     message: 'Error sending verification email'
    //   });
    // }

    res.status(201).send({
      status : 201,
      message: 'User created successfully',
      user: user
    });
  }
  catch (error){
    console.error(error);
    res.status(500).send({
      status : 500,
      message: error,
    });
  }
});

/* Verify Email */
router.get('/verify', async (req, res) => {
  try {
    // Get token from query parameter
    const token = req.query.token;

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Update user's email verified flag in database
    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.send({
      status : 201,
      message: 'Email verified successfully',
      user: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status : 500,
      message: error,
    });
  }
});

/* Resend Verification Email */
router.post(
  '/resend-verification-email', 
  async (req, res) => {
  try {

     // Validate request
     const validator = new RequestValidator({
      email: 'email',
    });
    const errors = validator.validate(req.body, {
      'email': 'required|email',
    });
    if(errors.length > 0) {
      return res.status(400).send({
        status: 400,
        message: errors
      });
    }
    // Get email from request body
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // If user doesn't exist, send error response
    if (!user) {
      return res.status(400).send({
        status : 400,
        message: 'User not found'
      });
    }

    // If user is already verified, send error response
    if (user.isVerified) {
      return res.status(400).send({        
        status : 400,
        message: 'Email already verified'
      });
    }

    // Generate new token and send verification email
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, token);

    res.status(200).send({        
      status : 200,
      message: 'Verification email sent successfully',
      user: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status : 500,
      message: error
    });
  }
});

/* Sign In */
router.post(
  '/signin',
  async (req, res) => {
  try {
    const validator = new RequestValidator.RequestValidator();
    const errors = validator.validate(req.body, {
      'email': 'required|email',
      'password': 'required|min:6|string',
    });
    if(errors.length > 0) {
      return res.status(400).send({
        status: 400,
        message: errors
      });
    }
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // If user doesn't exist, send error response
    if (!user) {
      return res.status(400).send({
        status : 400,
        message: 'User not found',
      });
    }

    // Compare password with hash
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    // If password is invalid, send error response
    if (!isValidPassword) {
      return res.status(400).send({
        status : 400,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ user_email: req.body.email, user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    user.token = token;
    user.save();

    res.status(200).send({
      status : 200,
      message: 'Sign in successful',
      user: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status : 500,
      message: error
    });
  }
});

/* Get User Profile with ID */
router.get('/:id', middlewareAuth, async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.userID });
    if (!user) {
      return res.status(400).send({
        status: 400,
        message: "User not found"
      });
    }
    return res.status(200).send({
      status : 200,
      user: user
    });
  }
  catch (error) {
    return res.status(500).send({
      status : 500,
      message: error
    });
  }
  });


module.exports = router;
