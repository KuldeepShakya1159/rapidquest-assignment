const mongoose = require('mongoose');

const shopifyCustomerSchema = new mongoose.Schema({},{ strict: false });

module.exports = mongoose.model('shopifyCustomers', shopifyCustomerSchema,'shopifyCustomers');
