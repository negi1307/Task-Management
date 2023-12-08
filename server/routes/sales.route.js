const express = require('express');
const salesRoute = express.Router();
const salesController = require('../controller/sales.controller');

salesRoute.post('/createTask', salesController.createTask);
salesRoute.get('/getTasks', salesController.getTasks);
salesRoute.put('/updateTask', salesController.updateTask);

module.exports = salesRoute;