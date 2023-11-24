const { mongoose } = require("mongoose");
const assignUserModel = require("../models/assignUser.model");
const taskModel = require("../models/task.model");

// Assign the user
const addUserAssignments = async (req, res) => {
  try {
    const { projectId, milestoneId, sprintId, taskId, assigneeId, reporterId } = req.body;
    const query = {
      assigneeId: assigneeId, // Always include assigneeId
    };
    // Add other fields to the query if they are present in the request body
    if (projectId) query.projectId = projectId;
    if (milestoneId) query.milestoneId = milestoneId;
    if (sprintId) query.sprintId = sprintId;
    if (taskId) query.taskId = taskId;
    if (reporterId) query.reporterId = reporterId;

    const alreadyAssigned = await assignUserModel.findOne(query);
    if (alreadyAssigned) {
      return res.status(200).json({ status: "400", message: `This ${projectId || milestoneId || sprintId || taskId} is already assigned to the User ${assigneeId}` });
    } else {
      const result = await assignUserModel.create({ projectId, milestoneId, sprintId, taskId, assigneeId, reporterId });
      return res.status(200).json({ status: "200", message: "Assigned Successfully", response: result });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get Project , milestones, and sprints of users
const getUserAssignments = async (req, res) => {
  try {
    let pageSize = 10;
    let todayDate = new Date()
    let { flag, skip, projectId, milestoneId, projectStatus } = req.query;
    let taskIds = await assignUserModel.distinct("taskId", { assigneeId: req.user._id });

    if (flag == 1) {
      let queries = [
        {
          $match: { _id: { $in: taskIds }, projectId: { $exists: true } }
        },
        // {
        //   $lookup : {
        //     from : 'projects',
        //     localField : 'projectId',
        //     foreignField : '_id',
        //     as : 'ProjectInfo'
        //   }
        // },
        {
          $lookup: {
            from: 'projects',
            let: { projectId: '$projectId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$projectId'] },
                      { $eq: ['$projectStatus', parseInt(projectStatus)] },
                      { $eq: ['$activeStatus', true] },
                    ]
                  }
                }
              }
            ],
            as: 'ProjectInfo'
          }
        },
        {
          $unwind: '$ProjectInfo'
        },
        {
          $addFields: {
            'ProjectInfo.daysLeft': {
              $max: [
                0,
                {
                  $round: [
                    {
                      $divide: [
                        { $subtract: ['$ProjectInfo.endDate', todayDate] },
                        1000 * 60 * 60 * 24,
                      ]
                    },
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$projectId',
            projectId: { $first: '$ProjectInfo' },
          }
        },
        {
          $sort: { 'ProjectInfo.daysLeft': 1 }
        },
        {
          $sort: { 'ProjectInfo.daysLeft': 1 }
        },
        {
          $sort: { 'ProjectInfo.daysLeft': 1 }
        }
      ];

      const count = await taskModel.aggregate(queries);
      const totalCount = count.length
      queries[6] = { $skip: (parseInt(skip) - 1) * pageSize }
      queries[7] = { $limit: pageSize };
      const projectDetails = await taskModel.aggregate(queries);
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: projectDetails, totalCount, totalPages });
    }
    if (flag == 2) {
      let queries = [
        {
          $match: { _id: { $in: taskIds }, projectId: mongoose.Types.ObjectId(projectId), milestoneId: { $exists: true } }
        },
        {
          $lookup: {
            from: 'milestones',
            localField: 'milestoneId',
            foreignField: '_id',
            as: 'MilestoneInfo'
          }
        },
        {
          $unwind: '$MilestoneInfo'
        },
        {
          $addFields: {
            'MilestoneInfo.daysLeft': {
              $max: [
                0,
                {
                  $round: [
                    {
                      $divide: [
                        { $subtract: ['$MilestoneInfo.completionDate', todayDate] },
                        1000 * 60 * 60 * 24,
                      ]
                    },
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$milestoneId',
            milestoneId: { $first: '$MilestoneInfo' },
          }
        },
        {
          $sort: { 'MilestoneInfo.daysLeft': 1 }
        },
        {
          $sort: { 'MilestoneInfo.daysLeft': 1 }
        },
        {
          $sort: { 'MilestoneInfo.daysLeft': 1 }
        }
      ];

      const count = await taskModel.aggregate(queries);
      const totalCount = count.length;
      queries[6] = { $skip: (parseInt(skip) - 1) * pageSize }
      queries[7] = { $limit: pageSize };
      const milestoneDetails = await taskModel.aggregate(queries);
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: milestoneDetails, totalCount, totalPages });
    }
    if (flag == 3) {
      let queries = [
        {
          $match: { _id: { $in: taskIds }, milestoneId: mongoose.Types.ObjectId(milestoneId), sprintId: { $exists: true } }
        },
        {
          $lookup: {
            from: 'sprints',
            localField: 'sprintId',
            foreignField: '_id',
            as: 'SprintInfo'
          }
        },
        {
          $unwind: '$SprintInfo'
        },
        {
          $addFields: {
            'SprintInfo.daysLeft': {
              $max: [
                0,
                {
                  $round: [
                    {
                      $divide: [
                        { $subtract: ['$SprintInfo.endDate', todayDate] },
                        1000 * 60 * 60 * 24,
                      ]
                    },
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$sprintId',
            sprintId: { $first: '$SprintInfo' },
          }
        },
        {
          $sort: { 'SprintInfo.daysLeft': 1 }
        },
        {
          $sort: { 'SprintInfo.daysLeft': 1 }
        },
        {
          $sort: { 'SprintInfo.daysLeft': 1 }
        }
      ];

      const count = await taskModel.aggregate(queries);
      const totalCount = count.length;
      queries[6] = { $skip: (parseInt(skip) - 1) * pageSize }
      queries[7] = { $limit: pageSize };
      const sprintDetails = await taskModel.aggregate(queries);
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: sprintDetails, totalCount, totalPages });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get A Users All tasks Acc to status & Search tasks & List of tasks
const getUserTasks = async (req, res) => {
  try {
    var pageSize = 10;
    let now = new Date();
    let { flag, activeStatus, searchString, projectId, milestoneId, sprintId, skip, status } = req.query;
    const query = {
      projectId: new mongoose.Types.ObjectId(projectId),
      milestoneId: new mongoose.Types.ObjectId(milestoneId),
      sprintId: new mongoose.Types.ObjectId(sprintId),
    };
    const taskIds = await taskModel.distinct('_id', query);
    // Flag = 1 :- Tasks acc to Status, Flag = 2 :- List of tasks
    if (flag == 1) {
      activeStatus = true
    }

    let queries = [
      {
        $match: { taskId: { $in: taskIds } },
      },
      {
        $lookup: {
          from: "users",
          localField: "assigneeId",
          foreignField: "_id",
          as: "assigneeInfo",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "reporterId",
          foreignField: "_id",
          as: "reporterInfo",
        },
      },
      // {
      //   $lookup: {
      //     from: "tasks",
      //     let: { taskId: "$taskId" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$_id", "$$taskId"] },
      //               // flag != 1 ?
      //               // { $eq: ['$status', parseInt(status)] } 
      //               // :
      //               { $eq: ["$activeStatus", JSON.parse(activeStatus)] },
      //             ],
      //           },
      //         },
      //       },
      //       {
      //         $match: { summary: { $regex: `.*${searchString.replace(/\s+/g, "\\s+")}.*`, $options: "i" } },
      //       },
      //     ],
      //     as: "taskInfo",
      //   },
      // },
      {
        $lookup: {
          from: "tasks",
          let: { taskId: "$taskId", flag: parseInt(flag), status: parseInt(status), activeStatus: JSON.parse(activeStatus) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$taskId"] },
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$$flag", 1] },
                            { $eq: ["$activeStatus", "$$activeStatus"] },
                          ],
                        },
                        {
                          $and: [
                            { $ne: ["$$flag", 1] },
                            { $eq: ["$status", "$$status"] },
                            { $eq: ["$activeStatus", "$$activeStatus"] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $match: { summary: { $regex: `.*${searchString.replace(/\s+/g, "\\s+")}.*`, $options: "i" } },
            },
          ],
          as: "taskInfo",
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "taskInfo.projectId",
          foreignField: "_id",
          as: "projectInfo"
        }
      },
      {
        $lookup: {
          from: "milestones",
          localField: "taskInfo.milestoneId",
          foreignField: "_id",
          as: "milestoneInfo"
        }
      },
      {
        $lookup: {
          from: "sprints",
          localField: "taskInfo.sprintId",
          foreignField: "_id",
          as: "sprintInfo"
        }
      },
      { $unwind: "$taskInfo" },
      { $unwind: "$assigneeInfo" },
      { $unwind: "$reporterInfo" },
      { $unwind: "$projectInfo" },
      { $unwind: "$milestoneInfo" },
      { $unwind: "$sprintInfo" },
      { $sort: { createdAt: -1 } },
      { $sort: { createdAt: -1 } },
      { $sort: { createdAt: -1 } },
      flag == 1 ? {
        $group: {
          _id: 'all',
          Todo: {
            $push: {
              $cond: {
                if: { $eq: ['$taskInfo.status', 1] },
                then: '$$ROOT', // Push the entire document
                else: null // Don't push if status is not "completed"
              }
            }
          },
          Inprogress: {
            $push: {
              $cond: {
                if: { $eq: ['$taskInfo.status', 2] },
                then: '$$ROOT',
                else: null
              }
            }
          },
          Hold: {
            $push: {
              $cond: {
                if: { $eq: ['$taskInfo.status', 3] },
                then: '$$ROOT',
                else: null
              }
            }
          },
          Done: {
            $push: {
              $cond: {
                if: { $eq: ['$taskInfo.status', 4] },
                then: '$$ROOT',
                else: null
              }
            }
          },
          TodoCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 1] }, then: 1, else: 0 } } },
          InprogressCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 2] }, then: 1, else: 0 } } },
          HoldCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 3] }, then: 1, else: 0 } } },
          DoneCount: { $sum: { $cond: { if: { $eq: ['$taskInfo.status', 4] }, then: 1, else: 0 } } },
          totalCount: { $sum: 1 },
          DueTasksCount: {
            $sum: {
              $cond: {
                if: { $and: [{ $lt: ['$taskInfo.dueDate', now] }, { $ne: ['$taskInfo.status', 4] }] }, then: 1, else: 0
              }
            }
          },
        }
      } :
        {
          $group: {
            _id: 'all',
            taskInfo: {
              $push: {
                _id: '$taskInfo._id',
                taskMannualId: '$taskInfo.taskMannualId',
                projectId: '$taskInfo.projectId',
                milestoneId: '$taskInfo.milestoneId',
                sprintId: '$taskInfo.sprintId',
                summary: '$taskInfo.summary',
                description: '$taskInfo.description',
                priority: '$taskInfo.priority',
                startDate: '$taskInfo.startDate',
                dueDate: '$taskInfo.dueDate',
                status: '$taskInfo.status',
                activeStatus: '$taskInfo.activeStatus',
                attachment: '$taskInfo.attachment',
                attachmentType: '$taskInfo.attachmentType',
                createdAt: '$taskInfo.createdAt',
                updatedAt: '$taskInfo.updatedAt',
                __v: '$taskInfo.__v',
                projectInfo: '$projectInfo',
                milestoneInfo: '$milestoneInfo',
                sprintInfo: '$sprintInfo',
                assigneeInfo: '$assigneeInfo',
                reporterInfo: '$reporterInfo'
              }
            },
            totalCount: { $sum: 1 }
          }
        },
      // {
      //     $match: {
      //         "Todo": { $ne: [null] },
      //         "Inprogress": { $ne: [null] },
      //         "Hold": { $ne: [null] },
      //         "Done": { $ne: [null] }
      //     }
      // },
      {
        $addFields: {
          Todo: {
            $filter: {
              input: '$Todo',
              as: 'task',
              cond: { $ne: ['$$task', null] }
            }
          },
          Inprogress: {
            $filter: {
              input: '$Inprogress',
              as: 'task',
              cond: { $ne: ['$$task', null] }
            }
          },
          Hold: {
            $filter: {
              input: '$Hold',
              as: 'task',
              cond: { $ne: ['$$task', null] }
            }
          },
          Done: {
            $filter: {
              input: '$Done',
              as: 'task',
              cond: { $ne: ['$$task', null] }
            }
          },
        }
      },
      {
        $project: flag == 1
          ? {
            _id: 0,
            Todo: 1,
            Inprogress: 1,
            Hold: 1,
            Done: 1,
            TodoCount: 1,
            InprogressCount: 1,
            HoldCount: 1,
            DoneCount: 1,
            totalCount: 1,
            DueTasksCount: 1
          }
          : {
            _id: 0,
            // projectInfo:1,
            // milestoneInfo : 1,
            // sprintInfo : 1,
            // assigneeInfo: 1,
            // reporterInfo: 1,
            taskInfo: 1,
            totalCount: 1
          },
      },
    ]
    let counts = [{ totalCount: 0 }]
    if (flag != "1") {
      counts = await assignUserModel.aggregate(queries);
      queries[14] = { $skip: (parseInt(skip) - 1) * pageSize }
      queries[15] = { $limit: pageSize };
    }
    const resultGet = await assignUserModel.aggregate(queries);
    const result = resultGet.length!=0?resultGet[0] :resultGet
    const totalCount = counts.length != 0 ? counts[0].totalCount : 0
    const totalPages = Math.ceil(totalCount / pageSize);
    return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: result, totalCount, totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// All assignees of A project
const projectUserList = async (req, res) => {
  try {
    const { projectId, milestoneId, sprintId } = req.query;
    const tasks = await taskModel.find({ projectId, milestoneId, sprintId });
    const taskIds = tasks.map((task) => task._id);
    const assignees = await assignUserModel.find({ taskId: { $in: taskIds } }).populate([
      { path: "assigneeId", select: "firstName lastName" },
      { path: "reporterId", select: "role" },
      { path: "taskId" },
    ]);
    // Create a map to store unique assigneeIds
    const uniqueAssigneesMap = new Map();
    // Filter out duplicate assigneeIds
    const uniqueAssignees = [];
    assignees.forEach((assignee) => {
      if (assignee.assigneeId && assignee.assigneeId._id) {
        const assigneeId = assignee.assigneeId._id.toString();
        if (!uniqueAssigneesMap.has(assigneeId)) { uniqueAssigneesMap.set(assigneeId, true); uniqueAssignees.push(assignee) }
      }
    });
    return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: uniqueAssignees });
  } catch (error) {
    return res.status(500).json({ status: "400", message: "Fill all the required fields", error: error.message });
  }
};


module.exports = { addUserAssignments, getUserAssignments, getUserTasks, projectUserList };
