const express = require('express');
const milestoneRoute = express.Router();
const milestone = require('../controller/milestone.controller');
const { verifyAdmin, verifyUser } = require('../middleware/jwt.auth');

milestoneRoute.post('/add', verifyAdmin, milestone.addMilestone);
milestoneRoute.put('/update', verifyAdmin, milestone.updateMilestone);
milestoneRoute.get('/getMilestones', verifyUser, milestone.getMilestones);

module.exports = milestoneRoute
