const projectModel = require("../models/project.model");
const projectupload = require('../models/projectupload.model');
const taskModel = require("../models/task.model")
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

// // get ALL projects According to activeStatus and ProjectStatus
const getProjects = async (req, res) => {
  try {
    const { activeStatus, projectStatus, skip } = req.query;
    const pageSize = 10;
    let query = {};
    query.activeStatus = activeStatus;
    query.projectStatus = projectStatus;

    const totalCount = await projectModel.countDocuments(query);
    let projects = await projectModel.find(query).sort({ createdAt: -1 }).skip((parseInt(skip) - 1) * pageSize).limit(pageSize);

    projects = projects.map(project => {
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const endDate = new Date(project.endDate);
      const startDate = new Date(project.startDate);
      const daysLeft = Math.max(0, Math.ceil((endDate - startDate) / millisecondsPerDay));
      return { ...project.toObject(), daysLeft };
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      status: "200",
      message: "Projects fetched successfully",
      response: projects,
      totalCount,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Something went wrong",
      error: error.message,
    });
  }
};



// Update a project
const updateProject = async (req, res) => {
  try {
    const projectId = req.body.projectId;
    const oldProject = await projectModel.findById(projectId);
    await projectModel.findByIdAndUpdate(projectId, req.body, { new: true });
    await userHistory(req, oldProject);
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
      await userHistory(req, oldProjectFile);
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



// total time in a project
const projectTotalTime = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const project = await taskModel.find({ projectId: projectId });
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    project.forEach(task => {
      if (task.timeTracker) {
        const timeParts = task.timeTracker.split(' ');
        totalHours += parseInt(timeParts[0]) || 0;
        totalMinutes += parseInt(timeParts[2]) || 0;
        totalSeconds += parseInt(timeParts[4]) || 0;
      }
    });

    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    const totalTime = `${totalHours} hours ${totalMinutes} minutes ${totalSeconds} seconds`;
    return res.status(200).json({ status: 200, message: "Project total time calculated", totalTime, project })
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message })
  }
}


// users projects record
// const getUsersProjects = async (req, res) => {
//   try {
//     const userIds = await taskModel.distinct("assigneeId");
//     const userProjects = {};
//     for (const userId of userIds) {
//       const userTasks = await taskModel.find({ assigneeId: userId }).populate('assigneeId').populate('projectId');


//     console.log(userTasks, "/////////////")

//     const projectIds = Array.from(new Set(userTasks.map(task => task.projectId)));
//       userProjects[userId] = projectIds;
//       console.log(projectIds,"=========================")
//     }

//     return res.status(200).json({ status: 200, message: "Users' projects retrieved successfully", userProjects: userProjects });
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message });
//   }
// }



// const getUsersProjects = async (req, res) => {
//   try {
//     const userIds = await taskModel.distinct("assigneeId");
//     const userProjects = {};

//     for (const userId of userIds) {
//       const userTasks = await taskModel.aggregate([
//         { $match: { assigneeId: userId } },
//         { $lookup: { from: "users", localField: "assigneeId", foreignField: "_id", as: "assigneeInfo" } },
//         { $unwind: "$assigneeInfo" },
//         { $lookup: { from: "projects", localField: "projectId", foreignField: "_id", as: "projectInfo" } },
//         { $unwind: "$projectInfo" },
//         {
//           $project: {
//             "assigneeInfo._id": 1,
//             "assigneeInfo.firstName": 1,
//             "assigneeInfo.lastName": 1,
//             "projectInfo._id": 1,
//             "projectInfo.name": 1,
//             "projectInfo.projectStatus": 1,
//             "projectInfo.projectType": 1
//           }
//         }
//       ]);

//       console.log(userTasks)
//       const projectIds = Array.from(new Set(userTasks.map(task => task.projectId)));
//       userProjects[userId] = projectIds;
//     }

//     return res.status(200).json({ status: 200, message: "Users' projects retrieved successfully", userProjects: userProjects });
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message });
//   }
// }

const getUsersProjects = async (req, res) => {
  try {
    const userIds = await taskModel.distinct("assigneeId");
    const userProjects = {};

    for (const userId of userIds) {
      const userTasks = await taskModel.aggregate([
        { $match: { assigneeId: userId } },
        { $lookup: { from: "users", localField: "assigneeId", foreignField: "_id", as: "assigneeInfo" } },
        { $unwind: "$assigneeInfo" },
        { $lookup: { from: "projects", localField: "projectId", foreignField: "_id", as: "projectInfo" } },
        { $unwind: "$projectInfo" },
        {
          $group: {
            _id: "$assigneeId",
            assigneeFirstName: { $first: "$assigneeInfo.firstName" },
            assigneeLastName: { $first: "$assigneeInfo.lastName" },
            projects: {
              $addToSet: {
                projectId: "$projectInfo._id",
                projectName: "$projectInfo.projectName",
                projectStatus: "$projectInfo.projectStatus",
                projectType: "$projectInfo.projectType"
              }
            }
          }
        }
      ]);

      userProjects[userId] = userTasks.length > 0 ? userTasks[0] : { _id: userId, assigneeFirstName: '', assigneeLastName: '', projects: [] };
    }

    return res.status(200).json({ status: 200, message: "Users' projects retrieved successfully", userProjects: userProjects });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message });
  }
}




module.exports = { addProject, getProjects, updateProject, uploadProject_File, getallProject, allProjectFiles, projectTotalTime, getUsersProjects };