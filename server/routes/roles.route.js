const express = require('express');
const rolesRoute = express.Router();
const roles = require('../controller/roles.controller');
const { verifyUser, verifyAdmin } = require('../middleware/jwt.auth');

rolesRoute.post('/addRole',verifyAdmin, roles.addRole);
rolesRoute.get('/getRoles', verifyUser, roles.getRoles);
rolesRoute.get('/getAllRoles', verifyUser, roles.getAllRoles);
rolesRoute.delete('/deleteRole', verifyAdmin,roles.deleteRole);

module.exports = rolesRoute;