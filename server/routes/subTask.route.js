const express = require("express");
const subTaskRoute = express.Router();
const subTask = require('../controller/subTask.controller');
const { verifyUser } = require("../middleware/jwt.auth");

subTaskRoute.post('/addSubTask', verifyUser, subTask.addSubTask);
subTaskRoute.put('/updateSubTask', verifyUser, subTask.updateSubTask);
subTaskRoute.get('/getSubTask', verifyUser, subTask.getSubTask);
subTaskRoute.delete('/deleteSubTask', verifyUser, subTask.deleteSubTask);
subTaskRoute.put("/updateSubTaskStatus", verifyUser, subTask.updateSubTaskStatus);



module.exports = subTaskRoute;