const express = require("express");
const leaveMessage = require('../controller/leaveMessage.controller');
const leavesRoute = express.Router();

leavesRoute.post('/addleaveReason', leaveMessage.addleaveReason);
leavesRoute.get('/getleaveReason', leaveMessage.getLeaveReason);

module.exports = leavesRoute;