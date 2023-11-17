const express = require('express');
const projectRoute = express.Router();
const projectPath = require('../controller/project.controller');
const { verifyAdmin } = require('../middleware/jwt.auth');
const { taskAttachmentUpload } = require('../middleware/multer');
const path = require('path');

projectRoute.use('/download', express.static(path.join(__dirname, '../upload')));

projectRoute.get('/getProjects', projectPath.getProjects);
projectRoute.post('/addProject', verifyAdmin, projectPath.addProject);
projectRoute.put('/update', verifyAdmin, projectPath.updateProject);
projectRoute.put('/updateStatus', verifyAdmin, projectPath.updateStatus);
projectRoute.post("/upload",taskAttachmentUpload.single('project'),projectPath.uploadProject_File)
projectRoute.get("/getProjectName",projectPath.getallProject);
projectRoute.get("/download/:filename",projectPath.download);

module.exports = projectRoute;
