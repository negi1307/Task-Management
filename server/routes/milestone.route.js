const express = require('express');
const milestoneRoute = express.Router();
const milestone = require('../controller/milestone.controller');
const { verifyAdmin, verifyUser, verifyAdminTester } = require('../middleware/jwt.auth');

milestoneRoute.post('/add', verifyAdminTester, milestone.addMilestone);
milestoneRoute.put('/update', verifyAdminTester, milestone.updateMilestone);
milestoneRoute.get('/getMilestones', verifyAdmin, milestone.getMilestones);

module.exports = milestoneRoute
