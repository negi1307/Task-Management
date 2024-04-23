const express = require('express');
const projectRoute = express.Router();
const projectPath = require('../controller/project.controller');
const { verifyAdmin, verifyUser } = require('../middleware/jwt.auth');
const { taskAttachmentUpload } = require('../middleware/multer');
const path = require('path');

projectRoute.use('/download', verifyAdmin, express.static(path.join(__dirname, '../upload')));

projectRoute.post('/addProject', verifyAdmin, projectPath.addProject);
projectRoute.get('/getProjects', verifyAdmin, projectPath.getProjects);
projectRoute.put('/update', verifyAdmin, projectPath.updateProject);
projectRoute.post("/upload", verifyAdmin, taskAttachmentUpload.single('project'), projectPath.uploadProject_File)
projectRoute.get("/getProjectName", verifyAdmin, projectPath.getallProject);
// projectRoute.get("/download/:filename",projectPath.download);
projectRoute.get("/files", verifyAdmin, projectPath.allProjectFiles);
projectRoute.get("/projectTime", projectPath.projectTotalTime);
projectRoute.get("/usersProjects", projectPath.getUsersProjects)
projectRoute.get("/projectsCount", projectPath.getProjectCount)
projectRoute.get("/projectTasks", projectPath.getProjectTasks)



module.exports = projectRoute;
