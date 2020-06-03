const Book = require('./../model/bookModel');

exports.getIndexPage = async (req, res, next) => {
  const book = await Book.find({ price: { $gte: 3500 } });
  // console.log(book);
  res.render('shop', {
    pageTitle: 'Dash Store',
    homepage: true,
    book: book
  });
};

exports.getCategory = async (req, res, next) => {
  // console.log(req.params.category);
  const books = await Book.find({ category: req.params.category });
  // console.log(books);
  res.render('category', {
    pageTitle: req.params.category,
    book: books,
    homepage: false
  });
};

exports.getProductDetailPage = async (req, res, next) => {
  const book = await Book.findById({ _id: req.params.id });
  res.render('details-page', {
    pageTitle: req.params.category,
    book: book,
    homepage: false
  });
};

exports.searchResult = async (req, res, next) => {
  // console.log(req.body);

  const book = await Book.find({
    $or: [
      { name: req.body.search.toLowerCase() },
      { author: req.body.search.toLowerCase() }
    ]
  });
  // console.log(book);
  // console.log(book[0].price);
  res.render('search-page', {
    pageTitle: 'Search result',
    homepage: false,
    book: book
  });

  // return next(new Error(err));
};
