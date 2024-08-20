const mongoose = require('mongoose');

const shopifyProductSchema = new mongoose.Schema({
  title: String,
  variants: [
    {
      price: Number,
    },
  ],
});

module.exports = mongoose.model('shopifyProduct', shopifyProductSchema);

