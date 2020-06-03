const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
// const bodyParser = require('body-parser');

const bookRoute = require('./routes/bookRoute');
const userRoute = require('./routes/userRoute');
const authController = require('./controller/authController');
const adminRoute = require('./routes/adminRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// body-parser
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// create the storage location for multer
const multerstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/book');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const name = file.originalname.split('.')[0];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});
// filters for only files that is an image
const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// multer middleware for every request
app.use(
  multer({
    storage: multerstorage,
    fileFilter: multerfilter
  }).single('image')
);

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(authController.isLoggedIn);
app.use(bookRoute);
app.use(userRoute);
app.use('/admin', adminRoute);

app.use((req, res, next) => {
  res.render('404', {
    pageTitle: 'page not found',
    homepage: false
  });
});
// global error handling middleware
app.use((error, req, res, next) => {
  res.render('500', {
    pageTitle: 'Error Page',
    homepage: false
  });
});

mongoose.connect('mongodb://localhost:27017/DashStore').then(() => {
  console.log('Database connection successful');
});
app.listen(3000, () => {
  console.log('app started on port 3000');
});
