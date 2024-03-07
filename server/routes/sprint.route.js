const express = require('express');
const sprintRoute = express.Router();
const path = require('../controller/sprint.controller');
const { verifyAdmin } = require('../middleware/jwt.auth');

sprintRoute.post('/add', verifyAdmin, path.addSprint);
sprintRoute.put('/update', verifyAdmin, path.updateSprint);
sprintRoute.get('/getAMilestoneAllSprints', path.getAMilestoneAllSprints);


module.exports = sprintRoute;