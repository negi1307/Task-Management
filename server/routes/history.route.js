const express = require("express");
const history = require('../controller/history.controller');
const historyRoute = express.Router();
const { verifyUser } = require("../middleware/jwt.auth");

historyRoute.get('/getHistory', verifyUser, history.getHistory);

module.exports = historyRoute;