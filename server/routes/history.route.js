const express = require("express");
const history = require('../controller/history.controller');
const historyRoute = express.Router();

historyRoute.get('/getHistory', history.getHistory);

module.exports =historyRoute;