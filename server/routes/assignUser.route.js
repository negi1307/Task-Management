const express = require("express");
const assignUser = require("../controller/assignUser.controller");
const { verifyEmployee, verifyAdmin } = require("../middleware/jwt.auth");
const assignUserRoute = express.Router();

assignUserRoute.post(
  "/addUserAssignments",
  verifyAdmin,
  assignUser.addUserAssignments
);
assignUserRoute.get("/getUserTasks", verifyEmployee, assignUser.getUserTasks);
assignUserRoute.get(
  "/getUserAssignments",
  verifyEmployee,
  assignUser.getUserAssignments
);

module.exports = assignUserRoute;
