const express = require('express');
const milestoneRoute = express.Router();
const milestone = require('../controller/milestone.controller');
const { verifyAdmin } = require('../middleware/jwt.auth');

milestoneRoute.post('/add', verifyAdmin, milestone.addMilestone);
milestoneRoute.put('/update', verifyAdmin, milestone.updateMilestone);
milestoneRoute.get('/getMilestones', verifyAdmin, milestone.getMilestones);

module.exports = milestoneRoute
