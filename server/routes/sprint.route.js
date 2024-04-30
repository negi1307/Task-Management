const express = require('express');
const sprintRoute = express.Router();
const path = require('../controller/sprint.controller');
const { verifyAdmin, verifyUser, verifyAdminTester } = require('../middleware/jwt.auth');

sprintRoute.post('/add', verifyAdminTester, path.addSprint);
sprintRoute.put('/update', verifyAdminTester, path.updateSprint);
sprintRoute.get('/getSprints', verifyAdmin, path.getSprints);


module.exports = sprintRoute;