const express = require('express');
const salesRoute = express.Router();
const salesController = require('../controller/sales.controller');
const { verifySeniority } = require('../middleware/jwt.auth');

salesRoute.post('/createTask', verifySeniority, salesController.createTask);
salesRoute.get('/getTasks', verifySeniority, salesController.getTasks);
salesRoute.put('/updateTask', verifySeniority, salesController.updateTask);

module.exports = salesRoute;