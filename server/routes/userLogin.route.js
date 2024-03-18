const express = require("express");
const userLogin = require("../controller/userLogin.controller");
const { verifyAdmin, verifyUser } = require('../middleware/jwt.auth');
const userLoginRoute = express.Router();


userLoginRoute.post("/loginTime", verifyUser, userLogin.userLogin);
userLoginRoute.put("/updateLogoutTime", verifyUser, userLogin.recordStopTime);
userLoginRoute.get("/getLoginTimeFile",verifyUser, userLogin.loginTimeRecord);


module.exports = userLoginRoute;