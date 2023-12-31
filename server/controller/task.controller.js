const mongoose = require("mongoose");
const taskModel = require("../models/task.model");
const assignUserModel = require("../models/assignUser.model");
const historyModel = require("../models/history.model");
const rolesModel = require('../models/role.model');

// Create or add tasks
const createtask = async (req, res) => {
  try {
    const { projectId, milestoneId, sprintId, summary, description, priority, assigneeId, startDate, dueDate, parentId } = req.body;
    const existingTask = await taskModel.findOne({
      summary: new RegExp(`^${summary.replace(/[\s]+/g, '\\s*')}\\s*$`, 'i'),
      sprintId: sprintId
    });
    if (existingTask) {
      return res.status(200).json({ status: "400", message: "Task already exists" });
    } else {
      const lastTask = await taskModel.countDocuments();
      const task = await taskModel.create({
        taskMannualId: lastTask + 1,
        projectId,
        milestoneId,
        sprintId,
        summary,
        description,
        priority,
        startDate,
        dueDate,
        attachment: `http://localhost:8000/upload/${req.file.originalname}`,
        attachmentType: req.file.mimetype,
        parentId
      });
      if (task) {
        const roles = ['CTO', 'PM', 'Admin'];
        const role = await rolesModel.findOne({ role: roles.includes(req.user.role) ? req.user.role : "PM" }).select("_id role");
        const assignedUser = await assignUserModel.create({
          assigneeId: roles.includes(req.user.role) ? assigneeId : req.user._id,
          reporterId: role._id,
          taskId: task._id,
        });
        return res.status(200).json({ status: "200", message: "Task created successfully", response: task, assignedUser });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};


const task_list = async (query, totalCount, pageSize, skip, arr) => {

  var tasks = await taskModel.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "projects",
      },
    },
    {
      $lookup: {
        from: "milestones",
        localField: "milestoneId",
        foreignField: "_id",
        as: "milestones",
      },
    },
    {
      $lookup: {
        from: "sprints",
        localField: "sprintId",
        foreignField: "_id",
        as: "sprints",
      },
    },
    {
      $lookup: {
        from: "assignusers",
        localField: "_id",
        foreignField: "taskId",
        as: "assignees",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignees.assigneeId",
        foreignField: "_id",
        as: "assigneeInfo",
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "assignees.reporterId",
        foreignField: "_id",
        as: "reporterInfo",
      },
    },
    {
      $unwind: "$assignees", // Unwind the assignees array
    },
    {
      $addFields: {
        "assignees.assigneeInfo": {
          $arrayElemAt: [
            {
              $filter: {
                input: "$assigneeInfo",
                as: "info",
                cond: { $eq: ["$$info._id", "$assignees.assigneeId"] },
              },
            },
            0,
          ],
        },
        "assignees.reporterId": "$assignees.reporterId",
        "assignees.reporterInfo": {
          $arrayElemAt: [
            {
              $filter: {
                input: "$reporterInfo",
                as: "reporter",
                cond: { $eq: ["$$reporter._id", "$assignees.reporterId"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        taskMannualId: { $first: "$taskMannualId" },
        summary: { $first: "$summary" },
        description: { $first: "$description" },
        priority: { $first: "$priority" },
        startDate: { $first: "$startDate" },
        dueDate: { $first: "$dueDate" },
        status: { $first: "$status" },
        activeStatus: { $first: "$activeStatus" },
        attachment: { $first: "$attachment" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        attachmentType: { $first: "$attachmentType" },
        projectInfo: { $first: { $arrayElemAt: ["$projects", 0] } },
        milestoneInfo: { $first: { $arrayElemAt: ["$milestones", 0] } },
        sprintInfo: { $first: { $arrayElemAt: ["$sprints", 0] } },
        assignees: { $first: { $arrayElemAt: [["$assignees"], 0] } },
      },
    },
    { $skip: (parseInt(skip) - 1) * pageSize }, // Skip the specified number of documents
    { $limit: pageSize },
    { $sort: { createdAt: -1 } },
  ]);
  arr.push(tasks)
  return arr;
}
// Get All tasks And Sprint id,s all tasks
const getTasks = async (req, res) => {
  try {
    var totalPages = 0;
    var totalCount = 0;
    const query = {};
    if (!req.query.sprintId && !req.query.taskStatus && parseInt(req.query.skip) === 1) {
      let query = {};
      const taskStatus = JSON.parse(req.query.taskStatus);
      query.activeStatus = JSON.parse(req.query.activeStatus)
      query.status = taskStatus;

      totalCount = await taskModel.countDocuments(query);
      var pageSize = 10;
      var skip = 1;
      let arr = [];
      totalPages = Math.ceil(totalCount / pageSize);

      const reponseCheck = await task_list(query, totalCount, pageSize, skip, arr);
      const [tasks] = reponseCheck;
      return reponseCheck ? res
        .status(200)
        .json({
          status: "200",
          message: "All Tasks fetched successfully",
          response: tasks,
          totalCount,
          totalPages,
        }) : null
      //  }


    }

    if (parseInt(req.query.skip) === 0) {
      if (req.query.sprintId) {
        totalCount = await taskModel.countDocuments(query);
        query.sprintId = new mongoose.Types.ObjectId(req.query.sprintId);
        query.activeStatus = JSON.parse(req.query.activeStatus);
        totalCount = await taskModel.countDocuments(query);
        var pageSize = totalCount === 0 ? 1 : totalCount;
        var skip = 1;
      } else {
        query.activeStatus = JSON.parse(req.query.activeStatus);
        totalCount = await taskModel.countDocuments(query);
        var pageSize = totalCount === 0 ? 1 : totalCount;
        var skip = 1;
      }
    } else {
      query.activeStatus = JSON.parse(req.query.activeStatus);
      var pageSize = 10;
      var skip = parseInt(req.query.skip);
    }
    totalCount = await taskModel.countDocuments(query);
    var tasks = await taskModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projects",
        },
      },
      {
        $lookup: {
          from: "milestones",
          localField: "milestoneId",
          foreignField: "_id",
          as: "milestones",
        },
      },
      {
        $lookup: {
          from: "sprints",
          localField: "sprintId",
          foreignField: "_id",
          as: "sprints",
        },
      },
      {
        $lookup: {
          from: "assignusers",
          localField: "_id",
          foreignField: "taskId",
          as: "assignees",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignees.assigneeId",
          foreignField: "_id",
          as: "assigneeInfo",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "assignees.reporterId",
          foreignField: "_id",
          as: "reporterInfo",
        },
      },
      {
        $unwind: "$assignees", // Unwind the assignees array
      },
      {
        $addFields: {
          "assignees.assigneeInfo": {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$assigneeInfo",
                  as: "info",
                  cond: { $eq: ["$$info._id", "$assignees.assigneeId"] },
                },
              },
              0,
            ],
          },
          "assignees.reporterId": "$assignees.reporterId",
          "assignees.reporterInfo": {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$reporterInfo",
                  as: "reporter",
                  cond: { $eq: ["$$reporter._id", "$assignees.reporterId"] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          taskMannualId: { $first: "$taskMannualId" },
          summary: { $first: "$summary" },
          description: { $first: "$description" },
          priority: { $first: "$priority" },
          startDate: { $first: "$startDate" },
          dueDate: { $first: "$dueDate" },
          status: { $first: "$status" },
          activeStatus: { $first: "$activeStatus" },
          attachment: { $first: "$attachment" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          attachmentType: { $first: "$attachmentType" },
          projectInfo: { $first: { $arrayElemAt: ["$projects", 0] } },
          milestoneInfo: { $first: { $arrayElemAt: ["$milestones", 0] } },
          sprintInfo: { $first: { $arrayElemAt: ["$sprints", 0] } },
          assignees: { $first: { $arrayElemAt: [["$assignees"], 0] } },
        },
      },
      { $skip: (parseInt(skip) - 1) * pageSize }, // Skip the specified number of documents
      { $limit: pageSize },
      { $sort: { createdAt: -1 } },
    ]);

    totalPages = Math.ceil(totalCount / pageSize);
    return res.status(200).json({ status: "200", message: "All Tasks fetched successfully", response: tasks, totalCount, totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const attachmentPath = req.file
      ? `http://localhost:8000/upload/${req.file.originalname}`
      : req.body.attachment;
    const fileExtension = req.file ? req.file.mimetype : undefined;
    const obj = {
      summary: req.body.summary,
      description: req.body.description,
      priority: req.body.priority,
      startDate: req.body.startDate,
      dueDate: req.body.dueDate,
      status: req.body.status,
      attachment: attachmentPath,
      attachmentType: fileExtension,
    };
    const secObj = { assigneeId: req.body.assigneeId, reporterId: req.body.reporterId };
    await taskModel.findByIdAndUpdate(taskId, obj, { new: true });
    await assignUserModel.findOneAndUpdate({ taskId }, secObj, { new: true });
    return res.status(200).json({ status: "200", message: "Task updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Delete A Task
const deleteTask = async (req, res) => {
  try {
    await taskModel.findByIdAndDelete({ _id: req.query.taskId });
    await assignUserModel.deleteMany({ taskId: req.query.taskId });
    return res.status(200).json({ status: "200", message: "Task Deleted successfully" });
  } catch (err) {
    return res.status(200).json({ status: "500", message: "Something went wrong", error: err.message });
  }
};

// update Status of a task
const updateTaskStatus = async (req, res) => {
  try {
    let existingTask = await taskModel.findById({ _id: req.body.taskId });
    await taskModel.findByIdAndUpdate({ _id: req.body.taskId }, { status: req.body.status }, { new: true });
    const HistoryTypeEnum = { CREATED: "created", UPDATED: "updated", DELETED: "deleted" };
    await historyModel.create({ type: HistoryTypeEnum.UPDATED, taskId: req.body.taskId, previousStatus: existingTask.status, currentStatus: req.body.status });
    return res.status(200).json({ status: "200", message: "Task Status updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// update Active inactive Status of a task
const updateTaskActiveStatus = async (req, res) => {
  try {
    let status;
    const data = await taskModel.findByIdAndUpdate({ _id: req.body.taskId }, { activeStatus: req.body.activeStatus }, { new: true });
    if (data) {
      req.body.activeStatus == false ? (status = "Deactivated") : (status = "Activated");
    }
    return res.status(200).json({ status: "200", message: `Task has been ${status} successfully` });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.stack });
  }
};

// Get tasks according to status
const getTasksAccToStatus = async (req, res) => {
  try {
    let { projectId, milestoneId, sprintId, searchString } = req.query;
    let todo = null;
    let inProgress = null;
    let hold = null;
    let done = null;
    let query = {};
    for (let i = 1; i < 5; i++) {
      if (projectId && milestoneId && sprintId) {
        query.projectId = new mongoose.Types.ObjectId(projectId);
        query.milestoneId = new mongoose.Types.ObjectId(milestoneId);
        query.sprintId = new mongoose.Types.ObjectId(sprintId);
        // query.activeStatus = JSON.parse(req.query.activeStatus);
        query.summary = { $regex: new RegExp(searchString, "i") };
        query.status = i;
      } else {
        query.summary = { $regex: new RegExp(searchString, "i") };
        query.status = i;
      }
      const tasks = await taskModel.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "projects",
          },
        },
        {
          $lookup: {
            from: "milestones",
            localField: "milestoneId",
            foreignField: "_id",
            as: "milestones",
          },
        },
        {
          $lookup: {
            from: "sprints",
            localField: "sprintId",
            foreignField: "_id",
            as: "sprints",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "taskId",
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "assignusers",
            localField: "_id",
            foreignField: "taskId",
            as: "assignees",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignees.assigneeId",
            foreignField: "_id",
            as: "assigneeInfo",
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "assignees.reporterId",
            foreignField: "_id",
            as: "reporterInfo",
          },
        },
        {
          $unwind: "$assignees", // Unwind the assignees array
        },
        {
          $addFields: {
            "assignees.assigneeInfo": {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$assigneeInfo",
                    as: "info",
                    cond: { $eq: ["$$info._id", "$assignees.assigneeId"] },
                  },
                },
                0,
              ],
            },
            "assignees.reporterId": "$assignees.reporterId",
            "assignees.reporterInfo": {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$reporterInfo",
                    as: "reporter",
                    cond: { $eq: ["$$reporter._id", "$assignees.reporterId"] },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            taskMannualId: { $first: "$taskMannualId" },
            summary: { $first: "$summary" },
            description: { $first: "$description" },
            priority: { $first: "$priority" },
            startDate: { $first: "$startDate" },
            dueDate: { $first: "$dueDate" },
            status: { $first: "$status" },
            activeStatus: { $first: "$activeStatus" },
            attachment: { $first: "$attachment" },
            attachmentType: { $first: "$attachmentType" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            projectInfo: { $first: { $arrayElemAt: ["$projects", 0] } },
            milestoneInfo: { $first: { $arrayElemAt: ["$milestones", 0] } },
            sprintInfo: { $first: { $arrayElemAt: ["$sprints", 0] } },
            assignees: { $first: { $arrayElemAt: [["$assignees"], 0] } },
            comments: { $first: { $arrayElemAt: [["$comments"], 0] } },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      let taskCount = await taskModel.countDocuments(query);

      if (i == 1) {
        todo = { tasks, taskCount };
      }
      if (i == 2) {
        inProgress = { tasks, taskCount };
      }
      if (i == 3) {
        hold = { tasks, taskCount };
      }
      if (i == 4) {
        done = { tasks, taskCount };
      }
    }
    const now = new Date();
    query.dueDate = { $lt: now };
    query.status = { $ne: 4 };
    const dueTasksCount = await taskModel.countDocuments(query);
    return res.status(200).json({ status: "200", message: "fetched successfully", Response: todo, inProgress, hold, done, dueTasksCount });
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
      const assigneeTasks = await assignUserModel.find({ assigneeId: req.user._id });
      let taskIds = assigneeTasks.map((id) => id.taskId);
      const firstPriority = await taskModel.countDocuments({ _id: { $in: taskIds }, priority: 1 });
      const secondPriority = await taskModel.countDocuments({ _id: { $in: taskIds }, priority: 2 });
      const thirdPriority = await taskModel.countDocuments({ _id: { $in: taskIds }, priority: 3 });
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
      const assigneeTasks = await assignUserModel.find({ assigneeId: req.user._id });
      let taskIds = assigneeTasks.map((id) => id.taskId);
      const todoCount = await taskModel.countDocuments({ _id: { $in: taskIds }, status: 1, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const inProgressCount = await taskModel.countDocuments({ _id: { $in: taskIds }, status: 2, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const holdCount = await taskModel.countDocuments({ _id: { $in: taskIds }, status: 3, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
      const doneCount = await taskModel.countDocuments({ _id: { $in: taskIds }, status: 4, createdAt: { $gte: sevenDaysAgo }, activeStatus: true });
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
      const assigneeTasks = await assignUserModel.find({ assigneeId: req.user._id });
      let taskIds = assigneeTasks.map((id) => id.taskId);
      const tasksCount = await taskModel.countDocuments({ _id: { $in: taskIds } });
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
      const assigneeTasks = await assignUserModel.find({ assigneeId: req.user._id });
      let taskIds = assigneeTasks.map((id) => id.taskId);
      const doneCount = await taskModel.countDocuments({ _id: { $in: taskIds }, status: 4, createdAt: { $gte: sevenDaysAgo } });
      const updatedCount = await taskModel.aggregate([
        {
          $match: {
            _id: { $in: taskIds },
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
      const createdCount = await taskModel.countDocuments({ _id: { $in: taskIds }, createdAt: { $gte: sevenDaysAgo } });
      const dueCount = await taskModel.countDocuments({ _id: { $in: taskIds }, status: { $ne: 4 }, dueDate: { $lte: now, $gte: sevenDaysAgo } });
      return res.status(200).json({ status: "200", message: "Tasks count fetched successfully", response: { doneCount, updatedCount: result, createdCount, dueCount } });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

module.exports = {
  createtask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskActiveStatus,
  getTasksAccToStatus,
  getPriorityTasks,
  getTasksStatusCount,
  getTasksCount,
  getTasksWeekCount,
};
