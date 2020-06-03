const express = require('express');
const bookController = require('./../controller/bookController');
// const adminController = require('./../controller/adminController');

const router = express.Router();

router.get('/', bookController.getIndexPage);
router.route('/category/:category').get(bookController.getCategory);
router.route('/book/:id').get(bookController.getProductDetailPage);
router.route('/search').post(bookController.searchResult);

module.exports = router;
