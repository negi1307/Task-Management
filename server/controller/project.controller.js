const projectModel = require("../models/project.model");
const projectupload = require('../models/projectupload.model');
const { userHistory } = require('../controller/history.controller');

// Add a new Project
const addProject = async (req, res) => {
  try {
    const { projectName, clientName, technology, startDate, endDate, projectDesc, projectType, projectStatus } = req.body;
    const existingProjectName = await projectModel.findOne({ projectName: new RegExp(`^${projectName.replace(/[\s]+/g, '\\s*')}\\s*$`, 'i') });
    if (existingProjectName) {
      return res.status(200).json({ status: "400", message: "Project Name Already exist" });
    } else {
      const result = await projectModel.create({
        projectName,
        clientName,
        technology,
        startDate,
        endDate,
        projectDesc,
        projectType,
        projectStatus,
      });
      await userHistory(req, "Create Project");
      return res.status(200).json({ status: "200", message: "Project created successfully", response: result });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// get ALL projects According to activeStatus and ProjectStatus
const getProjects = async (req, res) => {
  try {
    const { activeStatus, projectStatus, skip } = req.query;;
    const pageSize = 10;
    let query = {};
    query.activeStatus = activeStatus
    query.projectStatus = projectStatus

    const totalCount = await projectModel.countDocuments(query);
    const projects = await projectModel.find(query).sort({ createdAt: -1 }).skip((parseInt(skip) - 1) * pageSize).limit(pageSize);
    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({ status: "200", message: "Projects fetched successfully", response: projects, totalCount, totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const projectId = req.body.projectId;
    const oldProject = await projectModel.findById(projectId);
    await projectModel.findByIdAndUpdate(projectId, req.body, { new: true });
    await userHistory(req,oldProject);
    return res.status(200).json({ status: "200", message: "Project updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

//upload file of project
const uploadProject_File = async (req, res) => {
  try {
    let projectId = req.body.projectId;
    let attachment = `http://localhost:8000/upload/${req.file.originalname}`;
    console.log(req.file.mimetype, "attachmentType",);
    let attachmentType = req.file.mimetype;
    let originalName = req.file.originalname;
    let fileName = req.body.fileName;
    if (projectId && attachment && fileName) {
      const data = await projectupload({ projectId, attachment, fileName, attachmentType, originalName });
      await data.save();
      const oldProjectFile = await projectModel.findById(projectId)
      await userHistory(req,  oldProjectFile);
      res.status(200).json({ status: '200', message: 'Project file uploaded Successfully' })
    }
    else {
      return res.status(200).json({ status: '500', message: 'Something went wrong' })
    }
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })
  }
}

// only project name Only-------------
const getallProject = async (req, res) => {
  try {
    const allProjectsName = await projectModel.find({ activeStatus: true }).select({ projectName: 1 }).sort({ createdAt: -1 });
    return res.status(200).json({ status: '200', message: 'Project file uploaded Successfully', response: allProjectsName })
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })
  }
};

// get api for particular files/attachments
const allProjectFiles = async (req, res) => {
  try {
    let skip = req.query.skip ? parseInt(req.query.skip) : 1;
    let pageSize = 10;
    let totalCount = await projectupload.find({ projectId: req.query.projectId }).countDocuments();
    const allProjectFiles = await projectupload.find({ projectId: req.query.projectId }).populate('projectId', "projectName").sort({ createdAt: -1 }).limit(pageSize).skip((skip - 1) * pageSize);
    const totalPages = Math.ceil(totalCount / pageSize);
    res.status(200).json({ status: '200', message: 'Project file get Successfully', response: allProjectFiles, totalCount, totalPages })
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })

  }
};



module.exports = { addProject, getProjects, updateProject, uploadProject_File, getallProject, allProjectFiles };