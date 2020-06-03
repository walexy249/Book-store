const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./../model/userModel');

exports.SignUpPage = (req, res, next) => {
  res.render('signup', {
    pageTitle: 'Signup',
    errorMessage: null,
    homepage: true
  });
};

exports.CreateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', {
        pageTitle: 'signup',
        errorMessage: errors.array()[0].msg,
        users: {
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.confirmPassword
        },
        homepage: true
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log('user already exist');
      return res.render('signup', {
        pageTitle: 'signup',
        errorMessage: 'Email already exist',
        users: {
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.confirmPassword
        },
        homepage: true
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      cart: {
        items: []
      }
    });
    console.log('user created successfully');
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

exports.loginPage = (req, res, next) => {
  res.render('login', {
    pageTitle: 'login',
    errorMessage: undefined,
    homepage: false
  });
};

exports.login = async (req, res, next) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('invalid email');
      return res.render('login', {
        pageTitle: 'login',
        errorMessage: 'Invalid email or password',
        users: {
          email: req.body.email,
          password: req.body.password
        },
        homepage: false
      });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      console.log('password does not match');
      return res.render('login', {
        pageTitle: 'login',
        errorMessage: 'Invalid email or password',
        users: {
          email: req.body.email,
          password: req.body.password
        },
        homepage: false
      });
    }
    req.user = user;
    const token = jwt.sign(
      { id: user._id, email: user.email },
      'my-ultra-long-jwt-secret-code',
      {
        expiresIn: '90d'
      }
    );
    res.cookie('jwt', token, {
      expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true
    });
    res.redirect('/');
    // console.log('logged in successfully');
  } catch (err) {
    console.log(err);
    // res.redirect('/login');
  }
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await jwt.verify(
        req.cookies.jwt,
        'my-ultra-long-jwt-secret-code'
      );
      if (!decoded) {
        res.locals.user = undefined;
        return next();
      }
      const currentUser = await User.findById({ _id: decoded.id });
      if (!currentUser) {
        return next();
      }
      res.locals.user = currentUser;
      res.locals.cartNumbers = currentUser.cart.items.length;
      let sum = 0;

      // eslint-disable-next-line no-restricted-syntax
      for (const cart of currentUser.cart.items) {
        sum += cart.quantity;
      }
      res.locals.cartNumbers = +sum;
      // console.log(currentUser);
      return next();
    }
    res.locals.user = undefined;

    next();
  } catch (err) {
    res.locals.user = undefined;

    return next();
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res.redirect('/');
    }
    const decoded = await jwt.verify(
      req.cookies.jwt,
      'my-ultra-long-jwt-secret-code'
    );

    // console.log(decoded);
    const user = await User.findById({ _id: decoded.id });
    if (!user) {
      return res.redirect('/');
    }
    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.redirect('/login');
  }
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.redirect('/');
};

exports.restricted = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log('you are not an admin');
    return res.redirect('/');
  }
  next();
};

// exports.get500 = (req, res, next) => {
//   res.render('500', {
//     pageTitle: 'server error',
//     errorMessage: null
//   });
// };
