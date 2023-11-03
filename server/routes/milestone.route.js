const express = require('express');
const milestoneRoute = express.Router();
const milestone = require('../controller/milestone.controller');
const { verifyAdmin } = require('../middleware/jwt.auth');

milestoneRoute.post('/add', verifyAdmin, milestone.addMilestone);
milestoneRoute.put('/update', verifyAdmin, milestone.updateMilestone);
milestoneRoute.put('/updateStatus', verifyAdmin, milestone.updateStatus);
milestoneRoute.get('/getMilestones', milestone.getMilestones);

module.exports = milestoneRoute
