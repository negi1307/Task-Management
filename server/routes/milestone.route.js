const express = require('express');
const milestoneRoute = express.Router();
const milestone = require('../controller/milestone.controller');

milestoneRoute.post('/add', milestone.addMilestone);
milestoneRoute.put('/update', milestone.updateMilestone);
milestoneRoute.put('/updateStatus', milestone.updateStatus);
milestoneRoute.get('/getMilestones', milestone.getMilestones);

module.exports = milestoneRoute
