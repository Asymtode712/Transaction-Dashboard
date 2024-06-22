const axios = require('axios');
const Product = require('../models/prodModel');

exports.initDB = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;
    await Product.deleteMany();     {/* For Avoiding Data Duplication in DB */}
    await Product.insertMany(products);
    res.status(200).send('Database initialized');
  } catch (error) {
    res.status(500).send('Error initializing database');
  }
};

exports.getTransactions = async (req, res) => {
    try {
      console.log('Query parameters:', req.query);
      const { month, search, page = 1, perPage = 10 } = req.query;
  
      console.log('Month:', month);
  
      if (!month) {
        return res.status(400).json({ error: 'Month parameter is required' });
      }
  
      const matchStage = {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: { $toDate: '$dateOfSale' } }, parseInt(month)] },
            ]
          }
        }
      };
  
      if (search) {
        matchStage.$match.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
        ];
      }
  
      console.log('MongoDB Match Stage:', JSON.stringify(matchStage));
  
      const aggregationPipeline = [
        matchStage,
        {
          $sort: { dateOfSale: -1 },
        },
        {
          $skip: (page - 1) * parseInt(perPage),
        },
        {
          $limit: parseInt(perPage),
        },
      ];
  
      const products = await Product.aggregate(aggregationPipeline);
      const total = await Product.countDocuments(matchStage.$match);
  
      console.log('Total products found:', total);
      console.log('Products returned:', products.length);
  
      res.json({
        total,
        page: parseInt(page),
        perPage: parseInt(perPage),
        products,
      });
    } catch (error) {
      console.error('Error in getTransactions:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };


exports.getStats = async (req, res) => {
    const { month } = req.query;

    try {
      const stats = await Product.aggregate([
        {
          $match: {
            dateOfSale: { $regex: `-${month.padStart(2, '0')}-` },
          },
        },
        {
          $group: {
            _id: null,
            totalSaleAmount: { $sum: { $cond: ['$sold', '$price', 0] } },
            soldItems: { $sum: { $cond: ['$sold', 1, 0] } },
            notSoldItems: { $sum: { $cond: ['$sold', 0, 1] } },
          },
        },
      ]);
  
      res.json(stats[0] || { totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching statistics' });
    }
};

exports.getBarChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const result = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $regex: `-${month.padStart(2, '0')}-` },
        },
      },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: ranges.map(r => r.min),
          default: 'Above 900',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bar chart data' });
  }
};

exports.getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const result = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $regex: `-${month.padStart(2, '0')}-` },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pie chart data' });
  }
};

exports.getCombinedData = async (req, res) => {
  const { month } = req.query;
  const baseUrl = `http://localhost:${process.env.PORT || 5000}/api`;

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`${baseUrl}/transactions?month=${month}`),
      axios.get(`${baseUrl}/stats?month=${month}`),
      axios.get(`${baseUrl}/barchart?month=${month}`),
      axios.get(`${baseUrl}/piechart?month=${month}`),
    ]);

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching combined data' });
  }
};
