const express = require("express");
const users = require("../controller/users.controller");
const { verifyUser, verifyAdmin } = require("../middleware/jwt.auth");
const userRoute = express.Router();


userRoute.post("/register", verifyAdmin, users.registerUser);
userRoute.post("/login", users.logInUser);
userRoute.get("", verifyAdmin, users.getUsers);
userRoute.delete("/deleteUser", verifyAdmin, users.deleteUser);
userRoute.get("/trackTime", users.trackTime);
userRoute.get("/getAssigneeList", verifyUser, users.getAssigneesList);
userRoute.get("/getReporterList", verifyUser, users.getReporterList);

module.exports = userRoute;