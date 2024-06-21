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

exports.listTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  const query = {
    dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
    ...(search && { $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: search, $options: 'i' } }
    ] })
  };
  const transactions = await Product.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));
  res.json(transactions);
};

exports.getStats = async (req, res) => {
  const { month } = req.query;
  const transactions = await Product.find({
    dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
  });
  const totalSaleAmount = transactions.reduce((sum, trans) => sum + trans.price, 0);
  const totalSoldItems = transactions.filter(trans => trans.sold).length;
  const totalNotSoldItems = transactions.length - totalSoldItems;
  res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
};

exports.getBarChartData = async (req, res) => {
  const { month } = req.query;
  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];
  const result = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
    const count = await Product.countDocuments({
      dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
      price: { $gte: min, $lte: max },
    });
    return { range, count };
  }));
  res.json(result);
};

exports.getPieChartData = async (req, res) => {
  const { month } = req.query;
  const categories = await Product.aggregate([
    { $match: { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  res.json(categories);
};

exports.getCombinedData = async (req, res) => {
  const { month } = req.query;
  const [statistics, barChartData, pieChartData] = await Promise.all([
    exports.getStatistics({ query: { month } }),
    exports.getBarChartData({ query: { month } }),
    exports.getPieChartData({ query: { month } }),
  ]);
  res.json({ statistics, barChartData, pieChartData });
};
