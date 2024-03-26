const express = require("express");
const preSales = require('../controller/preSales.controller');
const { verifyAdmin, verifySeniority, verifyUser } = require("../middleware/jwt.auth");
const preSalesRoute = express.Router();

preSalesRoute.post('/addPreSalesData',verifySeniority, preSales.createPreSales);
preSalesRoute.get('/getPreSalesData',verifyUser, preSales.getPreSaleData);
preSalesRoute.put('/updatePreSales',verifySeniority, preSales.updatePreSalesData);
preSalesRoute.delete('/deletePreSales',verifySeniority, preSales.deletePreSaleData);

module.exports = preSalesRoute;