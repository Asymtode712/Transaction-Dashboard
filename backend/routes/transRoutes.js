const express = require('express');
const router = express.Router();
const {
  initDB,
  getTransactions,
  getStats,
  getBarChartData,
  getPieChartData,
  getCombinedData,
} = require('../controllers/transController');

router.get('/initdb', initDB);
router.get('/transactions', getTransactions);
router.get('/stats', getStats);
router.get('/barchart', getBarChartData);
router.get('/piechart', getPieChartData);
router.get('/combined-data', getCombinedData);

module.exports = router;
