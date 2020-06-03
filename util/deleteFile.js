const fs = require('fs');
const path = require('path');

exports.deleteImage = filename => {
  fs.unlink(
    path.join(__dirname, '..', 'public', 'images', 'book', filename),
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
};
