const express = require("express");
const subTaskRoute = express.Router();
const subTask = require('../controller/subTask.controller');
const { verifyUser } = require("../middleware/jwt.auth");
const { taskAttachmentUpload } = require('../middleware/multer');

subTaskRoute.post('/addSubTask', verifyUser, taskAttachmentUpload.single('attachment'), subTask.addSubTask);
subTaskRoute.put('/updateSubTask', verifyUser, taskAttachmentUpload.single('attachment'), subTask.updateSubTask);
subTaskRoute.get('/getSubTask', verifyUser, subTask.getSubTask);
subTaskRoute.delete('/deleteSubTask', verifyUser, subTask.deleteSubTask);
subTaskRoute.put("/updateSubTaskStatus", verifyUser, subTask.updateSubTaskStatus);



module.exports = subTaskRoute;