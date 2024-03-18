const express = require("express");
const leaveMessage = require('../controller/leaveMessage.controller');
const { verifySeniority, verifyUser } = require("../middleware/jwt.auth");
const leavesRoute = express.Router();

leavesRoute.post('/addleaveReason', verifySeniority, leaveMessage.addleaveReason);
leavesRoute.get('/getleaveReason', verifyUser, leaveMessage.getLeaveReason);

module.exports = leavesRoute;