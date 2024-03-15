const mongoose = require("mongoose");
const taskModel = require("../models/task.model");
const { userHistory } = require('../controller/history.controller');
const projectModel = require("../models/project.model");
const milestoneModel = require("../models/milestone.model");
const sprintModel = require("../models/sprint.model");

// Create or add tasks
const createtask = async (req, res) => {
  try {
    const { projectId, milestoneId, sprintId, summary, description, priority, expectedHours, startDate, dueDate, assigneeId, parentId, reporterId } = req.body;
    const existingTask = await taskModel.findOne({
      summary: new RegExp(`^${summary.replace(/[\s]+/g, '\\s*')}\\s*$`, 'i'),
      sprintId: sprintId
    });
    if (existingTask) {
      return res.status(200).json({ status: "400", message: "Task already exists" });
    } else {
      const lastTask = await taskModel.countDocuments();
      const attachmentPath = req.file ? `http://localhost:8000/upload/${req.file.originalname}` : req.body.attachment;
      const fileExtension = req.file ? req.file.mimetype : undefined;
      const task = await taskModel.create({
        taskMannualId: lastTask + 1,
        projectId,
        milestoneId,
        sprintId,
        summary,
        description,
        priority,
        expectedHours,
        startDate,
        dueDate,
        attachment: attachmentPath,
        attachmentType: fileExtension,
        parentId,
        reporterId,
        assigneeId,
        lastUpdaterId: req.user._id
      });
      return res.status(200).json({ status: "200", message: "Task created successfully", response: task });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// Get All tasks Of a Sprint with filters
const getTasks = async (req, res) => {
  try {
    const { sprintId, status, activeStatus, skip } = req.query;
    const pageSize = 10;
    const totalCount = await taskModel.countDocuments({sprintId: sprintId, status: status, activeStatus: activeStatus})
    const tasks = await taskModel.aggregate([
      {
        $match: {
          sprintId: new mongoose.Types.ObjectId(sprintId), status: parseInt(status), activeStatus: JSON.parse(activeStatus)
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projects",
        },
      },
      { $unwind: "$projects" },
      {
        $lookup: {
          from: "milestones",
          localField: "milestoneId",
          foreignField: "_id",
          as: "milestones",
        },
      },
      { $unwind: "$milestones" },
      {
        $lookup: {
          from: "sprints",
          localField: "sprintId",
          foreignField: "_id",
          as: "sprints",
        },
      },
      { $unwind: "$sprints" },
      {
        $lookup: {
          from: "users",
          localField: "assigneeId",
          foreignField: "_id",
          as: "assigneeInfo",
        },
      },
      { $unwind: "$assigneeInfo" },
      {
        $lookup: {
          from: "users",
          localField: "reporterId",
          foreignField: "_id",
          as: "reporterInfo",
        },
      },
      { $unwind: "$reporterInfo" },
      {
        $lookup: {
          from: "users",
          localField: "lastUpdaterId",
          foreignField: "_id",
          as: "lastUpdaterInfo",
        },
      },
      { $unwind: "$lastUpdaterInfo" },
      {
        $project: {
          "projects._id": 1,
          "projects.projectName": 1,
          "milestones._id": 1,
          "milestones.title": 1,
          "sprints._id": 1,
          "sprints.sprintName": 1,
          _id: 1,
          taskMannualId: 1,
          summary: 1,
          description: 1,
          priority: 1,
          expectedHours: 1,
          startDate: 1,
          dueDate: 1,
          status: 1,
          activeStatus: 1,
          attachment: 1,
          attachmentType: 1,
          createdAt: 1,
          updatedAt: 1,
          daysLeft: {
            $divide: [
              { $subtract: ["$endDate", "$startDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
          "assigneeInfo._id":1,
          "assigneeInfo.firstName":1,
          "assigneeInfo.lastName":1,
          "assigneeInfo.role":1,
          "reporterInfo._id":1,
          "reporterInfo.firstName":1,
          "reporterInfo.lastName":1,
          "reporterInfo.role":1,
          "lastUpdaterInfo._id": 1,
          "lastUpdaterInfo.firstName": 1,
          "lastUpdaterInfo.lastName": 1,
          "lastUpdaterInfo.role": 1,
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(skip) - 1) * pageSize },
      { $limit: pageSize }
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    return res.status(200).json({ status: "200", message: "Tasks Fetched successfully", response: tasks, totalCount, totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// Update Task
const updateTask = async (req, res) => {
  try {
    const { taskId, summary, description, priority, expectedHours, startDate, dueDate, activeStatus, attachment } = req.body;
    const attachmentPath = req.file ? `http://localhost:8000/upload/${req.file.originalname}` : attachment;
    const fileExtension = req.file ? req.file.mimetype : undefined;
    const obj = {
      summary,
      description,
      priority,
      expectedHours,
      startDate,
      dueDate,
      activeStatus,
      attachment: attachmentPath,
      attachmentType: fileExtension,
      lastUpdaterId: req.user._id
    };
    await taskModel.findByIdAndUpdate(taskId, obj, { new: true });
    return res.status(200).json({ status: "200", message: "Task updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Delete A Task
const deleteTask = async (req, res) => {
  try {
    await taskModel.findByIdAndDelete({ _id: req.query.taskId });
    return res.status(200).json({ status: "200", message: "Task Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: err.message });
  }
};

// update Status of a task AND TimeTracking
const updateTaskStatus = async (req, res) => {
  try {
    if (Object.keys(req.body).length !== 0) {
      const { taskId, status } = req.body;
      const task = await taskModel.findById(taskId);

      let query = { status };
      if (status === 2) {
        if (status <= currentStatus && req.user.role !== 'Testing') {
          return res.status(403).json({ status: "403", message: "You are not authorized to update the task status backwards." });
      }
        query.inProgressDate = new Date();
      }

      if (status === 4) {
        if (req.user.role === 'Testing') {
          query.doneDate = new Date();
          if (task && task.inProgressDate) {
            let timeDifference = (query.doneDate.getTime() - task.inProgressDate.getTime());
            query.timeTracker = timeDifference
          }
          if (task && task.logInTime && task.timeTracker) {
            let timeDifference = (query.doneDate.getTime() - task.logInTime.getTime());
            query.timeTracker = task.timeTracker + timeDifference
          }
        }
        else {
          return res.status(200).json({ status: "200", message: "You are not authorised to do so."});
        }
      }
      const result = await taskModel.findByIdAndUpdate({ _id: taskId }, query, { new: true });
      return res.status(200).json({ status: "200", message: "Task Status updated successfully", data: result });
    } else {
      const tasks = await taskModel.find({ assigneeId: req.user._id, status: 2 });
      if (tasks.length > 0) {
        for (const task of tasks) {
          const updatedLogOutTime = await taskModel.findByIdAndUpdate(
            { _id: task._id },
            { $currentDate: { logOutTime: true } },
            { new: true }
          );

          if (updatedLogOutTime) {
            const taskDetails = await taskModel.findById(task._id);

            if (taskDetails && taskDetails.logOutTime && taskDetails.inProgressDate) {
              let timeDifference = taskDetails.logOutTime.getTime() - taskDetails.inProgressDate.getTime();
              await taskModel.findByIdAndUpdate({ _id: task._id }, { timeTracker: timeDifference }, { new: true });
            }

            if (taskDetails && taskDetails.logInTime && taskDetails.logOutTime) {
              let timeDifference = taskDetails.logOutTime.getTime() - taskDetails.logInTime.getTime();
              await taskModel.findByIdAndUpdate({ _id: task._id }, { timeTracker: taskDetails.timeTracker + timeDifference }, { new: true });
            }
          }
        }
        await userHistory(req, "Tasks updated");
        return res.status(200).json({ status: "200", message: "Tasks updated successfully" });
      }
      return res.status(200).json({ status: "200", message: "No tasks found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get tasks according to status
const getTasksAccToStatus = async (req, res) => {
  try {
    let { sprintId, searchString } = req.query;
    let todo = [];
    let inProgress = [];
    let hold = [];
    let done = [];
    let testing = [];

    const tasks = await taskModel.aggregate([
      {
        $match: {
          sprintId: new mongoose.Types.ObjectId(sprintId), summary: { $regex: new RegExp(searchString, "i") }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projects",
        },
      },
      { $unwind: "$projects" },
      {
        $lookup: {
          from: "milestones",
          localField: "milestoneId",
          foreignField: "_id",
          as: "milestones",
        },
      },
      { $unwind: "$milestones" },
      {
        $lookup: {
          from: "sprints",
          localField: "sprintId",
          foreignField: "_id",
          as: "sprints",
        },
      },
      { $unwind: "$sprints" },
      {
        $lookup: {
          from: "users",
          localField: "assigneeId",
          foreignField: "_id",
          as: "assigneeInfo",
        },
      },
      { $unwind: "$assigneeInfo" },
      {
        $lookup: {
          from: "users",
          localField: "reporterId",
          foreignField: "_id",
          as: "reporterInfo",
        },
      },
      { $unwind: "$reporterInfo" },
      {
        $lookup: {
          from: "users",
          localField: "lastUpdaterId",
          foreignField: "_id",
          as: "lastUpdaterInfo",
        },
      },
      { $unwind: "$lastUpdaterInfo" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "taskId",
          as: "comments",
        }
      },
      {
        $project: {
          "projects._id": 1,
          "projects.projectName": 1,
          "milestones._id": 1,
          "milestones.title": 1,
          "sprints._id": 1,
          "sprints.sprintName": 1,
          _id: 1,
          taskMannualId: 1,
          summary: 1,
          description: 1,
          priority: 1,
          expectedHours: 1,
          startDate: 1,
          dueDate: 1,
          status: 1,
          activeStatus: 1,
          attachment: 1,
          attachmentType: 1,
          createdAt: 1,
          updatedAt: 1,
          daysLeft: {
            $divide: [
              { $subtract: ["$endDate", "$startDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
          "assigneeInfo._id": 1,
          "assigneeInfo.firstName": 1,
          "assigneeInfo.lastName": 1,
          "assigneeInfo.role": 1,
          "reporterInfo._id": 1,
          "reporterInfo.firstName": 1,
          "reporterInfo.lastName": 1,
          "reporterInfo.role": 1,
          "lastUpdaterInfo._id": 1,
          "lastUpdaterInfo.firstName": 1,
          "lastUpdaterInfo.lastName": 1,
          "lastUpdaterInfo.role": 1,
          comments: 1
        }
      },
      { $sort: { createdAt: -1 } },
    ]);
    tasks.forEach(task => {
      switch (task.status) {
        case 1:
          todo.push(task);
          break;
        case 2:
          inProgress.push(task);
          break;
        case 3:
          hold.push(task);
          break;
        case 4:
          done.push(task);
          break;
        case 5:
          testing.push(task);
          break;
        default:
          break;
      }
    });
    const todoCount = todo.length;
    const inProgressCount = inProgress.length;
    const holdCount = hold.length;
    const doneCount = done.length;
    const testingCount = testing.length;
    const now = new Date();
    const dueTasksCount = await taskModel.countDocuments({ sprintId: sprintId, dueDate: { $lt: now }, status: { $ne: 4 } });
    return res.status(200).json({ status: "200", message: "fetched successfully", Response: { todo, todoCount, inProgress, inProgressCount, hold, holdCount, done, doneCount, testing, testingCount, dueTasksCount } });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Priority breakdown of Tasks for a User as well as For admin
const getPriorityTasks = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const firstPriority = await taskModel.countDocuments({ priority: 1 });
      const secondPriority = await taskModel.countDocuments({ priority: 2 });
      const thirdPriority = await taskModel.countDocuments({ priority: 3 });
      const taskPriorityCount = [
        { name: "High", count: firstPriority },
        { name: "Medium", count: secondPriority },
        { name: "Low", count: thirdPriority },
      ];
      return res.status(200).json({ status: "200", message: "Prioity wise tasks for Admin fetched successfully", response: taskPriorityCount });
    } else {
      const firstPriority = await taskModel.countDocuments({ assigneeId: req.user._id, priority: 1 });
      const secondPriority = await taskModel.countDocuments({assigneeId: req.user._id, priority: 2 });
      const thirdPriority = await taskModel.countDocuments({ assigneeId: req.user._id, priority: 3 });
      const taskPriorityCount = [
        { name: "High", count: firstPriority },
        { name: "Medium", count: secondPriority },
        { name: "Low", count: thirdPriority },
      ];
      return res.status(200).json({ status: "200", message: "Priority wise tasks for User fetched successfully", response: taskPriorityCount });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get overview of tasks Status Count
const getTasksStatusCount = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days ago
    if (req.user.role === 'Admin') {
      const todoCount = await taskModel.countDocuments({ status: 1, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const inProgressCount = await taskModel.countDocuments({ status: 2, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const holdCount = await taskModel.countDocuments({ status: 3, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const doneCount = await taskModel.countDocuments({ status: 4, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const taskStatusCount = [
        { name: "todo", count: todoCount },
        { name: "inProgress", count: inProgressCount },
        { name: "hold", count: holdCount },
        { name: "Done", count: doneCount },
      ];
      return res.status(200).json({ status: "200", message: "Tasks count for Admin fetched successfully", response: taskStatusCount });
    } else {
      const todoCount = await taskModel.countDocuments({ assigneeId: req.user._id, status: 1, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const inProgressCount = await taskModel.countDocuments({assigneeId: req.user._id, status: 2, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const holdCount = await taskModel.countDocuments({ assigneeId: req.user._id, status: 3, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const doneCount = await taskModel.countDocuments({ assigneeId: req.user._id, status: 4, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const taskStatusCount = [
        { name: "todo", count: todoCount },
        { name: "inProgress", count: inProgressCount },
        { name: "hold", count: holdCount },
        { name: "Done", count: doneCount },
      ];
      return res.status(200).json({ status: "200", message: "Tasks count for User fetched successfully", response: taskStatusCount });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get count of all tasks
const getTasksCount = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const tasksCount = await taskModel.countDocuments();
      return res.status(200).json({ status: "200", message: "Tasks count for admin fetched successfully", response: { tasksCount } });
    } else {
      const tasksCount = await taskModel.countDocuments({ assigneeId: req.user._id});
      return res.status(200).json({ status: "200", message: "Tasks count for user fetched successfully", response: { tasksCount } });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get count of Done, updated, Created, and dueTasks of last 7 days
const getTasksWeekCount = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days ago
    if (req.user.role === 'Admin') {
      const doneCount = await taskModel.countDocuments({ status: 4, createdAt: { $gte: sevenDaysAgo } });
      const updatedCount = await taskModel.aggregate([
        {
          $match: {
            updatedAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $addFields: {
            updatedAtDate: {
              $toDate: "$updatedAt",
            },
          },
        },
        {
          $match: {
            $expr: { $ne: ["$createdAt", "$updatedAtDate"] },
          },
        },
        {
          $count: "updatedCount",
        },
      ]);
      const result = updatedCount.length > 0 ? updatedCount[0].updatedCount : 0;
      const createdCount = await taskModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
      const dueCount = await taskModel.countDocuments({ status: { $ne: 4 }, dueDate: { $lte: now, $gte: sevenDaysAgo } });
      return res.status(200).json({ status: "200", message: "Tasks count fetched successfully", response: { doneCount, updatedCount: result, createdCount, dueCount } });
    } else {
      const doneCount = await taskModel.countDocuments({ assigneeId: req.user._id, status: 4, createdAt: { $gte: sevenDaysAgo } });
      const updatedCount = await taskModel.aggregate([
        {
          $match: {
            assigneeId: new mongoose.Types.ObjectId(req.user._id),
            updatedAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $addFields: {
            updatedAtDate: {
              $toDate: "$updatedAt",
            },
          },
        },
        {
          $match: {
            $expr: { $ne: ["$createdAt", "$updatedAtDate"] },
          },
        },
        {
          $count: "updatedCount",
        },
      ]);
      const result = updatedCount.length > 0 ? updatedCount[0].updatedCount : 0;
      const createdCount = await taskModel.countDocuments({ assigneeId: req.user._id, createdAt: { $gte: sevenDaysAgo } });
      const dueCount = await taskModel.countDocuments({ assigneeId: req.user._id, status: { $ne: 4 }, dueDate: { $lte: now, $gte: sevenDaysAgo } });
      return res.status(200).json({ status: "200", message: "Tasks count fetched successfully", response: { doneCount, updatedCount: result, createdCount, dueCount } });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get A Users All tasks Acc to status & Search tasks & List of tasks
// const getUserTasks = async (req, res) => {
//   try {
//     var pageSize = 10;
//     let now = new Date();
//     let { flag, activeStatus, searchString, projectId, milestoneId, sprintId, skip, status } = req.query;
//     const query = {
//       projectId: new mongoose.Types.ObjectId(projectId),
//       milestoneId: new mongoose.Types.ObjectId(milestoneId),
//       sprintId: new mongoose.Types.ObjectId(sprintId),
//     };
//     const taskIds = await taskModel.distinct('_id', query);
//     // Flag = 1 :- Tasks acc to Status, Flag = 2 :- List of tasks
//     if (flag == 1) {
//       activeStatus = true
//     }

//     let queries = [
//       {
//         $match: { taskId: { $in: taskIds } },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "assigneeId",
//           foreignField: "_id",
//           as: "assigneeInfo",
//         },
//       },
//       {
//         $lookup: {
//           from: "roles",
//           localField: "reporterId",
//           foreignField: "_id",
//           as: "reporterInfo",
//         },
//       },
//       // {
//       //   $lookup: {
//       //     from: "tasks",
//       //     let: { taskId: "$taskId" },
//       //     pipeline: [
//       //       {
//       //         $match: {
//       //           $expr: {
//       //             $and: [
//       //               { $eq: ["$_id", "$$taskId"] },
//       //               // flag != 1 ?
//       //               // { $eq: ['$status', parseInt(status)] } 
//       //               // :
//       //               { $eq: ["$activeStatus", JSON.parse(activeStatus)] },
//       //             ],
//       //           },
//       //         },
//       //       },
//       //       {
//       //         $match: { summary: { $regex: `.*${searchString.replace(/\s+/g, "\\s+")}.*`, $options: "i" } },
//       //       },
//       //     ],
//       //     as: "taskInfo",
//       //   },
//       // },
//       {
//         $lookup: {
//           from: "tasks",
//           let: { taskId: "$taskId", flag: parseInt(flag), status: parseInt(status), activeStatus: JSON.parse(activeStatus) },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$_id", "$$taskId"] },
//                     {
//                       $or: [
//                         {
//                           $and: [
//                             { $eq: ["$$flag", 1] },
//                             { $eq: ["$activeStatus", "$$activeStatus"] },
//                           ],
//                         },
//                         {
//                           $and: [
//                             { $ne: ["$$flag", 1] },
//                             { $eq: ["$status", "$$status"] },
//                             { $eq: ["$activeStatus", "$$activeStatus"] },
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               },
//             },
//             {
//               $match: { summary: { $regex: `.*${searchString.replace(/\s+/g, "\\s+")}.*`, $options: "i" } },
//             },
//           ],
//           as: "taskInfo",
//         },
//       },
//       {
//         $lookup: {
//           from: "projects",
//           localField: "taskInfo.projectId",
//           foreignField: "_id",
//           as: "projectInfo"
//         }
//       },
//       {
//         $lookup: {
//           from: "milestones",
//           localField: "taskInfo.milestoneId",
//           foreignField: "_id",
//           as: "milestoneInfo"
//         }
//       },
//       {
//         $lookup: {
//           from: "sprints",
//           localField: "taskInfo.sprintId",
//           foreignField: "_id",
//           as: "sprintInfo"
//         }
//       },
//       { $unwind: "$taskInfo" },
//       { $unwind: "$assigneeInfo" },
//       { $unwind: "$reporterInfo" },
//       { $unwind: "$projectInfo" },
//       { $unwind: "$milestoneInfo" },
//       { $unwind: "$sprintInfo" },
//       { $sort: { createdAt: -1 } },
//       { $sort: { createdAt: -1 } },
//       { $sort: { createdAt: -1 } },
//       flag == 1 ? {
//         $group: {
//           _id: 'all',
//           Todo: {
//             $push: {
//               $cond: {
//                 if: { $eq: ['$taskInfo.status', 1] },
//                 then: '$$ROOT', // Push the entire document
//                 else: null // Don't push if status is not "completed"
//               }
//             }
//           },
//           Inprogress: {
//             $push: {
//               $cond: {
//                 if: { $eq: ['$taskInfo.status', 2] },
//                 then: '$$ROOT',
//                 else: null
//               }
//             }
//           },
//           Hold: {
//             $push: {
//               $cond: {
//                 if: { $eq: ['$taskInfo.status', 3] },
//                 then: '$$ROOT',
//                 else: null
//               }
//             }
//           },
//           Done: {
//             $push: {
//               $cond: {
//                 if: { $eq: ['$taskInfo.status', 4] },
//                 then: '$$ROOT',
//                 else: null
//               }
//             }
//           },
//           TodoCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 1] }, then: 1, else: 0 } } },
//           InprogressCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 2] }, then: 1, else: 0 } } },
//           HoldCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 3] }, then: 1, else: 0 } } },
//           DoneCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 4] }, then: 1, else: 0 } } },
//           totalCount: { $sum: 1 },
//           DueTasksCount: {
//             $sum: {
//               $cond: {
//                 if: { $and: [{ $lt: ['$taskInfo.dueDate', now] }, { $ne: ['$taskInfo.status', 4] }] }, then: 1, else: 0
//               }
//             }
//           },
//         }
//       } :
//         {
//           $group: {
//             _id: 'all',
//             taskInfo: {
//               $push: {
//                 _id: '$taskInfo._id',
//                 taskMannualId: '$taskInfo.taskMannualId',
//                 projectId: '$taskInfo.projectId',
//                 milestoneId: '$taskInfo.milestoneId',
//                 sprintId: '$taskInfo.sprintId',
//                 summary: '$taskInfo.summary',
//                 description: '$taskInfo.description',
//                 priority: '$taskInfo.priority',
//                 expectedHours: '$taskInfo.expectedHours',
//                 startDate: '$taskInfo.startDate',
//                 dueDate: '$taskInfo.dueDate',
//                 status: '$taskInfo.status',
//                 activeStatus: '$taskInfo.activeStatus',
//                 attachment: '$taskInfo.attachment',
//                 attachmentType: '$taskInfo.attachmentType',
//                 createdAt: '$taskInfo.createdAt',
//                 updatedAt: '$taskInfo.updatedAt',
//                 __v: '$taskInfo.__v',
//                 projectInfo: '$projectInfo',
//                 milestoneInfo: '$milestoneInfo',
//                 sprintInfo: '$sprintInfo',
//                 assigneeInfo: '$assigneeInfo',
//                 reporterInfo: '$reporterInfo'
//               }
//             },
//             totalCount: { $sum: 1 }
//           }
//         },
//       // {
//       //     $match: {
//       //         "Todo": { $ne: [null] },
//       //         "Inprogress": { $ne: [null] },
//       //         "Hold": { $ne: [null] },
//       //         "Done": { $ne: [null] }
//       //     }
//       // },
//       {
//         $addFields: {
//           Todo: {
//             $filter: {
//               input: '$Todo',
//               as: 'task',
//               cond: { $ne: ['$$task', null] }
//             }
//           },
//           Inprogress: {
//             $filter: {
//               input: '$Inprogress',
//               as: 'task',
//               cond: { $ne: ['$$task', null] }
//             }
//           },
//           Hold: {
//             $filter: {
//               input: '$Hold',
//               as: 'task',
//               cond: { $ne: ['$$task', null] }
//             }
//           },
//           Done: {
//             $filter: {
//               input: '$Done',
//               as: 'task',
//               cond: { $ne: ['$$task', null] }
//             }
//           },
//         }
//       },
//       {
//         $project: flag == 1
//           ? {
//             _id: 0,
//             Todo: 1,
//             Inprogress: 1,
//             Hold: 1,
//             Done: 1,
//             TodoCount: 1,
//             InprogressCount: 1,
//             HoldCount: 1,
//             DoneCount: 1,
//             totalCount: 1,
//             DueTasksCount: 1
//           }
//           : {
//             _id: 0,
//             // projectInfo:1,
//             // milestoneInfo : 1,
//             // sprintInfo : 1,
//             // assigneeInfo: 1,
//             // reporterInfo: 1,
//             taskInfo: 1,
//             totalCount: 1
//           },
//       },
//     ]
//     let counts = [{ totalCount: 0 }]
//     if (flag != "1") {
//       counts = await assignUserModel.aggregate(queries);
//       queries[14] = { $skip: (parseInt(skip) - 1) * pageSize }
//       queries[15] = { $limit: pageSize };
//     }
//     const resultGet = await assignUserModel.aggregate(queries);
//     const result = resultGet.length != 0 ? resultGet[0] : resultGet
//     const totalCount = counts.length != 0 ? counts[0].totalCount : 0
//     const totalPages = Math.ceil(totalCount / pageSize);
//     return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: result, totalCount, totalPages });
//   } catch (error) {
//     return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
//   }
// }

// All assignees of A project
const projectUserList = async (req, res) => {
  try {
    const { projectId, milestoneId, sprintId } = req.query;
    const tasks = await taskModel.find({ projectId, milestoneId, sprintId })
    const taskIds = tasks.map((task) => task._id);
    const assignees = await taskModel.find({ taskId: { $in: taskIds } }).populate([
      { path: "assigneeId", select: "firstName lastName" },
      { path: "reporterId", select: "role" },
      { path: "taskId" },
    ]);
    // Create a map to store unique assigneeIds
    const uniqueAssigneesMap = new Map();
    // Filter out duplicate assigneeIds
    const uniqueAssignees = [];
    assignees.forEach((assignee) => {
      if (assignee.taskId && assignee.taskId._id) {
        const taskId = assignee.taskId._id.toString();
        if (!uniqueAssigneesMap.has(taskId)) { uniqueAssigneesMap.set(taskId, true); uniqueAssignees.push(assignee) }
      }
    });
    // const users = await taskModel.find({ projectId: projectId })
    return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: uniqueAssignees });
  } catch (error) {
    return res.status(500).json({ status: "400", message: "Fill all the required fields", error: error.message });
  }
};

// Get User Assignments- Projects, milestones, and sprints
const getUserAssignments = async (req, res) => {
  try {
    const {flag, projectId, milestoneId, skip} = req.query;
    const pageSize = 10;
    const now = new Date();

    if (flag == 1) {
      const projectIds = await taskModel.distinct('projectId', { assigneeId: req.user._id });
      const projects = await projectModel.aggregate([
        {
          $match: { _id: { $in: projectIds } }
        },
        {
          $lookup:{
            from: "technologies",
            localField: "technology",
            foreignField: "_id",
            as: "technologies"
          }
        },
        {
          $project: {
              _id: 1,
              projectName: 1,
              clientName : 1,
              technologies: 1,
              startDate: 1,
              endDate: 1,
              activeStatus: 1,
              projectStatus: 1,
              projectType: 1,
              createdAt: 1,
              updatedAt: 1,
              daysLeft: {
                  $divide: [
                      { $subtract: ["$endDate", now] },
                      1000 * 60 * 60 * 24,
                  ],
              },
          }
      },
        { $sort: { daysLeft: 1 } },
        { $skip: (parseInt(skip) - 1) * pageSize },
        { $limit: pageSize }
      ]);
      const totalCount = projects.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({ status: "200", message: "Projects Fetched Successfully", response: projects, totalCount, totalPages });
    }
    if (flag == 2) {
      const milestoneIds = await taskModel.distinct('milestoneId', { assigneeId: req.user._id });
      const milestones = await milestoneModel.aggregate([
        {
          $match : { _id : { $in : milestoneIds}, projectId: new mongoose.Types.ObjectId(projectId)}
        },
        {
          $project: {
              _id: 1,
              title: 1,
              description : 1,
              startDate: 1,
              completionDate: 1,
              activeStatus: 1,
              createdAt: 1,
              updatedAt: 1,
              daysLeft: {
                  $divide: [
                      { $subtract: ["$completionDate", now] },
                      1000 * 60 * 60 * 24,
                  ],
              },
          }
        },
        { $sort: { daysLeft: 1 } },
        { $skip: (parseInt(skip) - 1) * pageSize },
        { $limit: pageSize }
      ]);
      const totalCount = milestones.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({ status: '200', message: 'Milestones Fetched Successfully', response: milestones, totalCount, totalPages });
    }
    if (flag == 3) {
      const sprintIds = await taskModel.distinct('sprintId', { assigneeId: req.user._id });
      const sprints = await sprintModel.aggregate([
        {
          $match: {_id: { $in: sprintIds }, milestoneId: mongoose.Types.ObjectId(milestoneId) }
        },
        {
          $project: {
              _id: 1,
              sprintName: 1,
              sprintDesc : 1,
              startDate: 1,
              endDate: 1,
              activeStatus: 1,
              createdAt: 1,
              updatedAt: 1,
              daysLeft: {
                  $divide: [
                      { $subtract: ["$endDate", now] },
                      1000 * 60 * 60 * 24,
                  ],
              },
          }
        },
        { $sort: { daysLeft: 1 } },
        { $skip: (parseInt(skip) - 1) * pageSize },
        { $limit: pageSize }
      ]);
      const totalCount = sprints.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({ status: '200', message: 'Sprint details fetch successfully', response: sprints, totalCount, totalPages })
    }
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
  }
}

module.exports = {
  createtask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTasksAccToStatus,
  getPriorityTasks,
  getTasksStatusCount,
  getTasksCount,
  getTasksWeekCount,
  getUserAssignments,
  // getUserTasks,
  projectUserList
};
