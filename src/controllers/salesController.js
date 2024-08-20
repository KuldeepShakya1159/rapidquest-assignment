const ShopifyOrder = require('../models/shopifyOrder');

const getTotalSalesOverTime = async (req, res) => {
  try {
    // Convert `created_at` to Date and perform daily aggregation
    const dailySales = await ShopifyOrder.aggregate([
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
          totalSales: {
            $sum: { $toDouble: "$total_price_set.shop_money.amount" }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Convert `created_at` to Date and perform monthly aggregation
    const monthlySales = await ShopifyOrder.aggregate([
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
            month: { $month: "$created_at" },
            year: { $year: "$created_at" }
          },
          totalSales: {
            $sum: { $toDouble: "$total_price_set.shop_money.amount" }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Convert `created_at` to Date and perform quarterly aggregation
    const quarterlySales = await ShopifyOrder.aggregate([
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
            quarter: {
              $ceil: { $divide: [{ $month: "$created_at" }, 3] }
            },
            year: { $year: "$created_at" }
          },
          totalSales: {
            $sum: { $toDouble: "$total_price_set.shop_money.amount" }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.quarter": 1 } }
    ]);

    // Convert `created_at` to Date and perform yearly aggregation
    const yearlySales = await ShopifyOrder.aggregate([
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
          _id: { year: { $year: "$created_at" } },
          totalSales: {
            $sum: { $toDouble: "$total_price_set.shop_money.amount" }
          }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);

    // Return the aggregated results in the required order
    console.log(
      ">>>>Daily Sales>>>>>",dailySales,
      ">>>>Monthly Sales>>>>>",monthlySales,
      ">>>>Qurartely Sales>>>>>",quarterlySales,
      ">>>>Yearly Sales>>>>>",yearlySales)
    res.json({
      dailySales,
      monthlySales,
      quarterlySales,
      yearlySales
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getSalesGrowthRateOverTime = async (req, res) => {
  try {
    // Step 1: Calculate total sales by month
    const monthlySales = await ShopifyOrder.aggregate([
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
            month: { $month: "$created_at" },
            year: { $year: "$created_at" }
          },
          totalSales: {
            $sum: { $toDouble: "$total_price_set.shop_money.amount" }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Step 2: Calculate growth rate
    const monthlySalesWithGrowth = monthlySales.map((current, index, array) => {
      if (index === 0) {
        // First period, no previous data to compare
        return { ...current, growthRate: null };
      } else {
        const previous = array[index - 1];
        const growthRate = ((current.totalSales - previous.totalSales) / previous.totalSales) * 100;
        return { ...current, growthRate };
      }
    });

    // Step 3: Return results
    res.json({ monthlySalesWithGrowth });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getTotalSalesOverTime,
  getSalesGrowthRateOverTime
};
