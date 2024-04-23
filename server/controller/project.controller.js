const projectModel = require("../models/project.model");
const projectupload = require('../models/projectupload.model');
const taskModel = require("../models/task.model")
const { userHistory } = require('../controller/history.controller');
const userModel = require("../models/users.model")

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
    const response = { totalCount, totalPages: Math.ceil(totalCount / pageSize), projects, };

    return res.status(200).json({ status: "200", message: "Projects fetched successfully", response });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message, });
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



// total time in a project and the diffrence also calculated
const projectTotalTime = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const projectTasks = await taskModel.find({ projectId: projectId });

    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    let expectedHoursSum = 0;

    projectTasks.forEach(task => {
      if (task.timeTracker) {
        const timeParts = task.timeTracker.split(' ');
        totalHours += parseInt(timeParts[0]) || 0;
        totalMinutes += parseInt(timeParts[2]) || 0;
        totalSeconds += parseInt(timeParts[4]) || 0;
      }
      expectedHoursSum += task.expectedHours || 0;
    });

    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    const totalTimeInSeconds = totalHours * 3600 + totalMinutes * 60 + totalSeconds;
    const totalTimeFormatted = `${totalHours} hours ${totalMinutes} minutes ${totalSeconds} seconds`;
    const expectedTimeInSeconds = expectedHoursSum * 3600;

    const differenceInSeconds = expectedTimeInSeconds - totalTimeInSeconds;
    const differenceHours = Math.floor(differenceInSeconds / 3600);
    const differenceMinutes = Math.floor((differenceInSeconds % 3600) / 60);
    const differenceSeconds = differenceInSeconds % 60;
    const differenceFormatted = `${differenceHours} hours ${differenceMinutes} minutes ${differenceSeconds} seconds`;

    return res.status(200).json({ status: 200, message: "Project total time calculated", totalTime: totalTimeFormatted, expectedTime: expectedHoursSum, difference: differenceFormatted, projectTasks });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message });
  }
}




// get the users projects record
const getUsersProjects = async (req, res) => {
  try {
    let matchStage = {};
    let skipValue = 0;
    let limitValue = 10;

    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      skipValue = (page - 1) * limit;
      limitValue = limit;
    }

    if (req.query.month) {
      const { month } = req.query;
      const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;

      const startDate = new Date(Date.UTC(new Date().getFullYear(), monthNumber - 1, 1));
      const endDate = new Date(Date.UTC(new Date().getFullYear(), monthNumber, 0, 23, 59, 59));

      matchStage = {
        createdAt: { $gte: startDate, $lte: endDate }
      };
    } else {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
      const endDate = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));

      matchStage = {
        createdAt: { $gte: startDate, $lte: endDate }
      };
    }

    const [userTasks, totalCount] = await Promise.all([
      taskModel.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "users",
            localField: "assigneeId",
            foreignField: "_id",
            as: "assigneeInfo"
          }
        },
        { $unwind: { path: "$assigneeInfo", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "projectInfo"
          }
        },
        { $unwind: "$projectInfo" },
        {
          $lookup: {
            from: "techcategories",
            localField: "assigneeInfo.designationId",
            foreignField: "_id",
            as: "designation"
          }
        },
        { $unwind: { path: "$designation", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "technologies",
            localField: "assigneeInfo.technologyId",
            foreignField: "_id",
            as: "technology"
          }
        },
        { $unwind: { path: "$technology", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$assigneeId",
            assigneeFirstName: { $first: "$assigneeInfo.firstName" },
            assigneeLastName: { $first: "$assigneeInfo.lastName" },
            assigneeDesignationName: { $first: "$designation.name" },
            assigneeTechnologyName: { $first: "$technology.techName" },
            projects: {
              $addToSet: {
                projectName: "$projectInfo.projectName",
                projectStatus: "$projectInfo.projectStatus",
                projectType: "$projectInfo.projectType"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            User_First_Name: "$assigneeFirstName",
            User_Last_Name: "$assigneeLastName",
            Designation: "$assigneeDesignationName",
            Technology: "$assigneeTechnologyName",
            projects: 1
          }
        },
        { $skip: skipValue },
        { $limit: limitValue }
      ]),
      taskModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$assigneeId"
          }
        },
        { $count: "totalCount" }
      ])
    ]);

    const totalUsers = totalCount.length > 0 ? totalCount[0].totalCount : 0;
    const totalPages = Math.ceil(totalUsers / limitValue); // Calculate total pages

    return res.status(200).json({ status: 200, message: "Users' projects retrieved successfully", userProjects: userTasks, totalCount: totalUsers, totalPages: totalPages, currentPage: req.query.page ? parseInt(req.query.page) : 1 });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message });
  }
}


// count the total projects and also according to their status
const getProjectCount = async (req, res) => {
  try {
    const projectCounts = await projectModel.aggregate([
      {
        $group: {
          _id: "$projectStatus",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: "$count" },
          projectStatusCounts: { $push: { status: "$_id", count: "$count" } }
        }
      }
    ]);

    const projectStatusCounts = {};
    projectCounts[0].projectStatusCounts.forEach(statusCount => { projectStatusCounts[statusCount.status] = statusCount.count });
    const response = { totalProjects: projectCounts[0].totalProjects, projectStatusCounts };
    return res.status(200).json({ status: 200, message: "Projects data fetched successfully", response });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: error.message });
  }
};


// specific project all tasks and their count also
const getProjectTasks = async (req, res) => {
  try {
    let skip = req.query.skip ? parseInt(req.query.skip) : 1;
    let pageSize = 10;
    const { projectId } = req.query;
    const totalCount = await taskModel.find({ projectId }).countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const allTasks = await taskModel.find({ projectId }).sort({ createdAt: -1 });

    const todoCount = allTasks.filter(task => task.status === 1).length;
    const inProgressCount = allTasks.filter(task => task.status === 2).length;
    const testingCount = allTasks.filter(task => task.status === 3).length;
    const doneCount = allTasks.filter(task => task.status === 4).length;
    const holdCount = allTasks.filter(task => task.status === 5).length;

    const project = await taskModel.find({ projectId }).sort({ createdAt: -1 }).limit(pageSize).skip((skip - 1) * pageSize);

    return res.status(200).json({
      status: 200,
      message: "All task of the project",
      totalCount,
      totalPages,
      todoCount,
      inProgressCount,
      testingCount,
      doneCount,
      holdCount,
      response: project
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
}




module.exports = { addProject, getProjects, updateProject, uploadProject_File, getallProject, allProjectFiles, projectTotalTime, getUsersProjects, getProjectCount, getProjectTasks };