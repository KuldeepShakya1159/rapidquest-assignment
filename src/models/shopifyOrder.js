const mongoose = require('mongoose');

const shopifyOrderSchema = new mongoose.Schema({},{ strict: false});

module.exports = mongoose.model('shopifyOrders', shopifyOrderSchema,'shopifyOrders');
