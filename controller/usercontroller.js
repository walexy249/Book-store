const Book = require('./../model/bookModel');
const User = require('./../model/userModel');

exports.addToCart = async (req, res, next) => {
  // console.log(req.user);
  if (!req.user) {
    return res.redirect('/login');
  }

  const book = await Book.findById({ _id: req.body.productId });
  // console.log(book);
  req.user.addToCart(book);
  res.redirect(`/category/${book.category}`);
};

exports.cartPage = async (req, res, next) => {
  const user = await User.findById({ _id: req.user._id }).populate(
    'cart.items.productId'
  );
  res.render('cart', {
    pageTitle: 'cart',
    cart: user.cart.items,
    totalPrice: user.cart.totalPrice,
    homepage: false
  });
};

exports.removeFromCart = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.user);
  await req.user.removeFromCart(req.body.productId, req.body.productPrice);
  res.redirect('/cart');
};
