const express = require('express');
const taskRouter = express.Router();
const tasks = require('../controller/task.controller');
const { verifyAdmin, verifyUser, verifyEmployee } = require('../middleware/jwt.auth');
const { taskAttachmentUpload } = require('../middleware/multer');

taskRouter.post("/createtask", verifyUser, taskAttachmentUpload.single('attachment'), tasks.createtask);
taskRouter.get("/getTasks", verifyUser, tasks.getTasks);
taskRouter.put("/updateTask", verifyAdmin, taskAttachmentUpload.single('attachment'), tasks.updateTask);
taskRouter.delete("/deletetask", verifyAdmin, tasks.deleteTask);
taskRouter.put("/updateTaskStatus", verifyUser, tasks.updateTaskStatus);
taskRouter.put("/updateTaskActiveStatus", verifyAdmin, tasks.updateTaskActiveStatus);
taskRouter.get("/getTasksAccToStatus", verifyAdmin, tasks.getTasksAccToStatus);
taskRouter.get("/getPriorityTasks", verifyUser, tasks.getPriorityTasks);
taskRouter.get("/getTasksStatusCount", verifyUser, tasks.getTasksStatusCount);
taskRouter.get("/getTasksCount", verifyUser, tasks.getTasksCount);
taskRouter.get("/getTasksWeekCount", verifyUser, tasks.getTasksWeekCount);

taskRouter.post('/addUserAssignments', verifyAdmin, tasks.addUserAssignments);
taskRouter.get('/getUserTasks', verifyEmployee, tasks.getUserTasks);
// taskRouter.get('/getUserAssignments', verifyEmployee, tasks.getUserAssignments);
taskRouter.get('/getuserListprojectAssigned', verifyUser, tasks.projectUserList);


module.exports = taskRouter;