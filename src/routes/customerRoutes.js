const express = require('express');
const router = express.Router();
const {newCustomerAddedOverTime,getRepeatCustomers,getGeographicalDistribution} = require('../controllers/customerController');

router.get('/new-customer-addded-over-time',newCustomerAddedOverTime);
router.get('/get-repeated-customers',getRepeatCustomers)
router.get('/get-geographical-distribuation',getGeographicalDistribution);
module.exports = router;
