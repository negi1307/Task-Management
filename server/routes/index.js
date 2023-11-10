const express = require('express');
const router = express.Router();

const userRoutes = require("./users.route");
const userLoginRoute = require("./userLogin.route");
const taskRoutes = require("./task.route");
const projectRoute = require("./project.route");
const sprintRoute = require("./sprint.route");
const milestoneRoute = require("./milestone.route");
const rolesRoute = require("./roles.route");
const technologyRoute = require("./technology.route");
const assignUserRoute = require("./assignUser.route");
const commentsRoute = require("./comments.route");
const historyRoute = require("./history.route");


router.use("/users", userRoutes);
router.use("/userLogin",userLoginRoute);
router.use("/task", taskRoutes);
router.use("/project", projectRoute);
router.use("/sprint", sprintRoute);
router.use("/milestone", milestoneRoute);
router.use("/roles", rolesRoute);
router.use("/technology", technologyRoute);
router.use("/assignUser", assignUserRoute);
router.use("/comments", commentsRoute);
router.use("/history", historyRoute);

module.exports = router;