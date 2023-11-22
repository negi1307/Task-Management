const express = require("express");
const preSales = require('../controller/preSales.controller');
const { verifyAdmin } = require("../middleware/jwt.auth");
const preSalesRoute = express.Router();

preSalesRoute.post('/addPreSalesData', preSales.createPreSales);
preSalesRoute.get('/getPreSalesData', preSales.getPreSaleData);
preSalesRoute.put('/updatePreSales', preSales.updatePreSalesData);
preSalesRoute.delete('/deletePreSales', preSales.deletePreSaleData);

module.exports = preSalesRoute;