const express = require('express');
const { body } = require('express-validator/check');
const authController = require('./../controller/authController');
const User = require('./../model/userModel');
const userController = require('./../controller/usercontroller');

const router = express.Router();
router
  .route('/signup')
  .get(authController.SignUpPage)
  .post(
    [
      body('email').custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject(new Error('Email already exist'));
        }
      }),
      body('password')
        .isLength({ min: 5 })
        .withMessage('password must be more than 5 characters'),
      body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('password must match');
        }
        return true;
      })
    ],
    authController.CreateUser
  );

router
  .route('/login')
  .get(authController.loginPage)
  .post(authController.login);

router.get('/cart', authController.isAuthenticated, userController.cartPage);
router.get('/logout', authController.logout);
router
  .route('/addToCart')
  .post(authController.isAuthenticated, userController.addToCart);
router
  .route('/removeFromCart')
  .post(authController.isAuthenticated, userController.removeFromCart);
// router.get('/500', authController.get500);
module.exports = router;
