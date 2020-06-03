const { validationResult } = require('express-validator/check');
const Book = require('./../model/bookModel');
const util = require('../util/deleteFile');

exports.getProductPage = (req, res, next) => {
  res.render('category', {
    pageTitle: 'Category',
    homepage: false
  });
};

exports.addProductPage = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'add-product',
    errorMessage: undefined,
    fileErrorMessage: undefined,
    homepage: false
  });
};

exports.addProduct = async (req, res, next) => {
  // console.log(req.body);
  const { name } = req.body;
  const { author } = req.body;
  const { price } = req.body;
  const { category } = req.body;
  const { description } = req.body;
  const image = req.file;
  // console.log(req.file);

  if (!image) {
    return res.render('add-product', {
      pageTitle: 'add-product',
      book: {
        name,
        author,
        price,
        description,
        category
      },
      errorMessage: 'Please attach an image file',
      homepage: false
    });
  }
  const errors = validationResult(req);
  console.log(image.filename);
  if (!errors.isEmpty()) {
    // console.log(errors);
    // console.log(errors.array());
    return res.render('add-product', {
      pageTitle: 'add-product',
      errorMessage: errors.array()[0].msg,
      fileErrorMessage: undefined,
      book: {
        name,
        author,
        price,
        description,
        category
      },
      homepage: false
    });
  }
  await Book.create({
    name,
    author,
    price,
    category,
    description,
    image: image.filename
  });

  // console.log(req.file);
  res.redirect(`/admin/category/${category}`);
};

exports.getCategory = async (req, res, next) => {
  console.log(req.params.category);
  const books = await Book.find({ category: req.params.category });
  // console.log(books);
  res.render('admin-category', {
    pageTitle: req.params.category,
    book: books,
    homepage: false
  });
};

exports.editProductPage = async (req, res, next) => {
  try {
    const book = await Book.findById({ _id: req.params.id });
    // console.log(book.description);
    res.render('edit-product', {
      pageTitle: req.params.category,
      book: book,
      errorMessage: null,
      homepage: false
    });
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  // console.log(req.body);
  const { name } = req.body;
  const { author } = req.body;
  const { price } = req.body;
  const { category } = req.body;
  const { description } = req.body;
  const image = req.file;
  // console.log(req.file);
  // if (!image) {
  //   res.render('add-product', {
  //     pageTitle: 'add-product',
  //     errorMessage: 'Attached file is not an image'
  //   });
  // }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('edit-product', {
      pageTitle: 'edit-product',
      errorMessage: errors.array()[0].msg,
      book: {
        name,
        author,
        price,
        description,
        id: req.params.id
      },
      homepage: false
    });
  }
  const book = await Book.findById({ _id: req.params.id });
  if (!book) {
    res.redirect('/');
  }
  book.name = name;
  book.author = author;
  book.price = price;
  book.description = description;
  book.category = category;
  if (image) {
    book.image = image.filename;
  }
  await book.save();
  // console.log(req.file);
  res.redirect(`/admin/category/${category}`);
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedCategory = await Book.findById({ _id: req.params.id });
    util.deleteImage(deletedCategory.image);
    await Book.findByIdAndRemove({ _id: req.params.id });
    res.redirect(`/admin/category/${deletedCategory.category}`);
  } catch (err) {
    console.log(err);
    return next(new Error(err));
  }
};
