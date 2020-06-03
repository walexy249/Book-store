const express = require('express');
const { body } = require('express-validator/check');
const adminController = require('./../controller/adminController');
const authController = require('./../controller/authController');

const router = express.Router();

router.use(authController.isAuthenticated);
router.use(authController.restricted);
router
  .route('/add-product')
  .get(adminController.addProductPage)
  .post(
    [
      body('name')
        .isString()
        .withMessage('Name of the book must only contains alphabet')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Name of the book must bee more than 4 character '),
      body('author')
        .isLength({ min: 5 })
        .withMessage('Name of the book must bee more than 4 character ')
        .isString()
        .trim(),
      body('price')
        .isFloat()
        .withMessage('price must be in decimal value'),
      body('description')
        .isLength({ min: 5, max: 400 })
        .withMessage('Description must be at least 5 characters or 400 max')
    ],
    adminController.addProduct
  );

router.route('/category/:category').get(adminController.getCategory);
router
  .route('/edit-product/:id')
  .get(adminController.editProductPage)
  .post(
    [
      body('name')
        .isString()
        .withMessage('Name of the book must only contains alphabet')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Name of the book must bee more than 4 character '),
      body('author')
        .isLength({ min: 5 })
        .withMessage('Name of the book must bee more than 4 character ')
        .isString()
        .trim(),
      body('price')
        .isFloat()
        .withMessage('price must be in decimal value'),
      body('description')
        .isLength({ min: 5, max: 400 })
        .withMessage('Description must be at least 5 characters or 400 max')
    ],
    adminController.updateProduct
  );
router.route('/delete-product/:id').get(adminController.deleteProduct);
module.exports = router;
