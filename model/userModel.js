const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      default: 0
    }
  }
});

userSchema.methods.addToCart = function(product) {
  const existingProductIndex = this.cart.items.findIndex(
    item => item.productId.toString() === product._id.toString()
  );
  // console.log(existingProductIndex);
  const updatedCart = [...this.cart.items];
  if (existingProductIndex >= 0) {
    updatedCart[existingProductIndex].quantity += 1;
  } else {
    updatedCart.push({
      productId: product._id,
      quantity: 1
    });
  }
  this.cart.items = updatedCart;
  this.cart.totalPrice += product.price;

  return this.save();
};

userSchema.methods.removeFromCart = function(productId, price) {
  const removeProductIndex = this.cart.items.findIndex(item => {
    return item.productId.toString() === productId.toString();
  });
  const updatedCart = [...this.cart.items];
  const itemQuantity = updatedCart[removeProductIndex].quantity;
  const itemtotalPrice = price * itemQuantity;
  this.cart.totalPrice = this.cart.totalPrice - itemtotalPrice;

  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;
