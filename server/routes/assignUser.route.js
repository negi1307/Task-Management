const express = require("express");
const assignUser = require('../controller/assignUser.controller');
const { verifyEmployee, verifyAdmin, verifyUser } = require("../middleware/jwt.auth");
const assignUserRoute = express.Router();

// assignUserRoute.post('/addUserAssignments', verifyAdmin, assignUser.addUserAssignments);
// assignUserRoute.get('/getUserTasks', verifyEmployee, assignUser.getUserTasks);
assignUserRoute.get('/getUserAssignments', verifyEmployee, assignUser.getUserAssignments);
// assignUserRoute.get('/getuserListprojectAssigned', verifyUser, assignUser.projectUserList);

module.exports = assignUserRoute;