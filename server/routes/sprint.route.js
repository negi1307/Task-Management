const express = require('express');
const sprintRoute = express.Router();
const path = require('../controller/sprint.controller');
const { verifyAdmin, verifyUser, verifyAdminTester } = require('../middleware/jwt.auth');

sprintRoute.post('/add', verifyAdmin, path.addSprint);
sprintRoute.put('/update', verifyAdminTester, path.updateSprint);
sprintRoute.get('/getSprints', verifyAdminTester, path.getSprints);


module.exports = sprintRoute;