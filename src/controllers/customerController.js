const customersModel = require('../models/shopifyCustomer');
const shopifyOrdersModel = require('../models/shopifyOrder');

const newCustomerAddedOverTime = async (req, res) => {
    try {
        // Group customers by the creation date to track new customers added over time
        const customersAddedOverTime = await customersModel.aggregate([
            {
                $addFields: {
                    created_at: {
                        $dateFromString: {
                            dateString: "$created_at"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$created_at" },
                        month: { $month: "$created_at" },
                        year: { $year: "$created_at" }
                    },
                    newCustomers: { $sum: 1 } // Counting the number of new customers
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } } // Sorting by date
        ]);

        console.log("New Customers Added Over Time:", customersAddedOverTime);
        res.json(customersAddedOverTime);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error while fetching data: ${error}`);
    }
}


const getRepeatCustomers = async (req, res) => {
    try {
        // Aggregation pipeline to identify repeat customers across different time frames
        const repeatCustomers = await shopifyOrdersModel.aggregate([
            // Convert the created_at field to a date object
            {
                $addFields: {
                    created_at: {
                        $dateFromString: {
                            dateString: "$created_at"
                        }
                    }
                }
            },
            // Group by customer and time frame
            {
                $group: {
                    _id: {
                        customer_id: "$customer.id",  // Ensure this matches your actual customer ID field
                        day: { $dayOfMonth: "$created_at" },
                        month: { $month: "$created_at" },
                        quarter: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } },
                        year: { $year: "$created_at" }
                    },
                    purchaseCount: { $sum: 1 } // Count the number of purchases per customer
                }
            },
            // Filter to include only repeat customers (more than one purchase)
            {
                $match: {
                    purchaseCount: { $gt: 1 }
                }
            },
            // Group by time frame to count repeat customers
            {
                $group: {
                    _id: {
                        day: "$_id.day",
                        month: "$_id.month",
                        quarter: "$_id.quarter",
                        year: "$_id.year"
                    },
                    repeatCustomers: { $sum: 1 } // Count the number of repeat customers
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } } // Sort by date
        ]);

        console.log("Repeat Customers:", repeatCustomers);
        res.json(repeatCustomers);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error while fetching data: ${error}`);
    }
};

const getGeographicalDistribution = async (req, res) => {
    try {
        const cityDistribution = await customersModel.aggregate([
            {
                $group: {
                    _id: "$default_address.city", // Group by city
                    customerCount: { $sum: 1 }   // Count customers in each city
                }
            },
            {
                $sort: { customerCount: -1 }  // Sort by number of customers, descending
            }
        ]);

        console.log("Geographical Distribution:", cityDistribution);
        res.json(cityDistribution);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error while fetching data: ${error}`);
    }
};



module.exports = { newCustomerAddedOverTime,getRepeatCustomers,getGeographicalDistribution };
