const express = require("express");
const users = require("../controller/users.controller");
const { verifyUser } = require("../middleware/jwt.auth");
const userRoute = express.Router();


userRoute.post("/register", users.registerUser);
userRoute.post("/login", users.logInUser);
userRoute.get("", users.getUsers);
userRoute.delete("/deleteUser", users.deleteUser);
userRoute.get("/trackTime", users.trackTime);
userRoute.get("/getAssigneeList",verifyUser, users.getAssigneesList);
userRoute.get("/getReporterList",verifyUser, users.getReporterList);

module.exports = userRoute;