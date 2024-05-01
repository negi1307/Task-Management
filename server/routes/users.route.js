const express = require("express");
const users = require("../controller/users.controller");
const { verifyUser, verifyAdmin, verifyAdminTester } = require("../middleware/jwt.auth");
const userRoute = express.Router();


userRoute.post("/register", verifyAdmin, users.registerUser);
userRoute.post("/login", users.logInUser);
userRoute.get("", verifyAdminTester, users.getUsers);
userRoute.delete("/deleteUser", verifyAdmin, users.deleteUser);
userRoute.get("/trackTime", verifyUser, users.trackTime);
userRoute.get("/getAssigneeList", verifyUser, users.getAssigneesList);
userRoute.get("/getReporterList", verifyUser, users.getReporterList);
userRoute.get("/subTaskTrackTime", verifyUser, users.subTaskTrackTime);
userRoute.get("/specificUserTask", users.specificUserTask)

module.exports = userRoute;