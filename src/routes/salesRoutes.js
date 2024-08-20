const express = require('express');
const { getTotalSalesOverTime,getSalesGrowthRateOverTime} = require('../controllers/salesController');  // Ensure this import is correct

const router = express.Router();

router.get('/total-sales-over-time', getTotalSalesOverTime);  // Make sure this function is defined
router.get('/get-growth-rate-over-time',getSalesGrowthRateOverTime)

module.exports = router;
