const projectModel = require("../models/project.model");
const { ObjectId } = require('mongodb');
const projectupload = require('../models/projectupload.model');
const path = require('path');

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
      return res.status(200).json({ status: "200", message: "Project created successfully", response: result });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// get project detail by "ongoing, delivered, support"
// const getProjects = async (req, res) => {
//   try {
//     const { activeStatus, projectStatus, projectId } = req.query;
//     let query = {};
//     if (activeStatus === undefined || activeStatus === '') {
//       query.activeStatus = true;
//     } else {
//       query.activeStatus = activeStatus === 'true';
//     }
//     if (projectStatus !== undefined && projectStatus !== '') {
//       query.projectStatus = projectStatus;
//     }
//     if (projectId !== undefined && projectId !== '') {
//       query._id = projectId;
//     }
//     const projects = await projectModel.find(query);
//     return res.status(200).json({ status: "200", message: "Projects fetched successfully", response: projects });
//   } catch (error) {
//     return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
//   }
// };

const getProjects = async (req, res) => {
  try {
    const { activeStatus, projectStatus, skip, limit = 10 } = req.query;
    let query = {};
    let options = { limit: parseInt(limit), skip: (parseInt(skip) - 1) * parseInt(limit) };
    if (activeStatus === undefined || activeStatus === '') {
      query.activeStatus = true;
    } else {
      query.activeStatus = activeStatus === 'true';
    }
    if (projectStatus !== undefined && projectStatus !== '') {
      query.projectStatus = projectStatus;
    }
    // if (projectId !== undefined && projectId !== '') {
    //   query._id = projectId;
    // }
    const totalCount = await projectModel.countDocuments(query);
    const projects = await projectModel.find(query, null, options);
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    return res.status(200).json({ status: "200", message: "Projects fetched successfully", response: projects, currentPage: parseInt(skip), totalPages, totalCount });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};



// Update a project
const updateProject = async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate({ _id: req.body.projectId }, req.body, { new: true });
    return res.status(200).json({ status: "200", message: "Project updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// update A project ActiveStatus
const updateStatus = async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate({ _id: req.body.projectId }, { activeStatus: req.body.activeStatus });
    return res.status(200).json({ status: '200', message: 'Project status updated Successfully' });
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })
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
      res.status(200).json({ status: '200', message: 'Project file uploaded Successfully' })
    }
    else {
      return res.status(200).json({ status: '500', message: 'Something went wrong' })
    }
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })
  }
}


// only project name-------------
const getallProject = async (req, res) => {
  try {
    const allProjectsName = await projectModel.find().select({ projectName: 1 }).sort({ createdAt: -1 });
    res.status(200).json({ status: '200', message: 'Project file uploaded Successfully', response: allProjectsName })
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })
  }
};

// //download a attachment/file  
// const download=async (req, res) => {
// try {

//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, '../upload', filename);

//   res.download(filePath, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send('File not found');
//     }
//     else{
//       console.log(filePath,"filePath  ")
//     }
//   });

// } catch (error) {
//   return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message })

//   }
// }

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




module.exports = { addProject, getProjects, updateProject, updateStatus, uploadProject_File, getallProject, allProjectFiles };
