const { mongoose } = require("mongoose");
const assignUserModel = require("../models/assignUser.model");
const taskModel = require("../models/task.model");
const { calculateDaysLeft } = require("../middleware/customFunctions");

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
      const { flag, skip } = req.query;
      const taskIds = await assignUserModel.distinct("taskId", { assigneeId: req.user._id });
      if (flag == 1) {
        const projectDetails = await taskModel.find({ _id: taskIds, projectId: { $exists: true } })
          .populate("projectId")
          .sort({ createdAt: -1 })
          .limit(pageSize)
          .skip((parseInt(skip) - 1) * pageSize);
        const uniqueProjectDetails = projectDetails.reduce((acc, project) => {
          const existingProject = acc.find((item) => item.projectId && item.projectId.equals(project.projectId._id));
          if (!existingProject) {
            const endDate = project.projectId.endDate;
            const daysLeft = calculateDaysLeft(endDate);
            project.projectId.daysLeft = daysLeft;
            acc.push(project)
          }
          return acc;
        }, []);
        const totalCount = uniqueProjectDetails.length;
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: uniqueProjectDetails, totalCount, totalPages });
      }
      if (flag == 2) {
        const milestoneDetails = await taskModel.find({ _id: taskIds, projectId: req.query.projectId, milestoneId: { $exists: true } })
          .populate("milestoneId")
          .sort({ createdAt: -1 })
          .limit(pageSize)
          .skip((parseInt(skip) - 1) * pageSize);
        const uniqueMilestoneDetails = milestoneDetails.reduce((acc, milestone) => {
          const existingMilestone = acc.find((item) => item.milestoneId && item.milestoneId.equals(milestone.milestoneId._id));
          if (!existingMilestone) {
            const endDate = milestone.milestoneId.completionDate;
            const daysLeft = calculateDaysLeft(endDate);
            milestone.milestoneId.daysLeft = daysLeft;
            acc.push(milestone)
          }
          return acc;
        },
          []);
        const totalCount = uniqueMilestoneDetails.length;
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: uniqueMilestoneDetails, totalCount, totalPages });
      }
      if (flag == 3) {
        const sprintDetails = await taskModel.find({ _id: taskIds, milestoneId: req.query.milestoneId, sprintId: { $exists: true } })
          .populate("sprintId")
          .sort({ createdAt: -1 })
          .limit(pageSize)
          .skip((parseInt(skip) - 1) * pageSize);
        const uniqueSprintDetails = sprintDetails.reduce((acc, sprint) => {
          const existingSprint = acc.find((item) => item.sprintId && item.sprintId.equals(sprint.sprintId._id));
          if (!existingSprint) {
            const endDate = sprint.sprintId.endDate;
            const daysLeft = calculateDaysLeft(endDate);
            sprint.sprintId.daysLeft = daysLeft;
            acc.push(sprint)
          }
          return acc;
        }, []);
        const totalCount = uniqueSprintDetails.length;
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: uniqueSprintDetails, totalCount, totalPages });
      }
    } catch (error) {
      return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
  };
//   try {
//     let pageSize = 10;
//     const { flag, skip } = req.query;
//     const taskIds = await assignUserModel.distinct("taskId", { assigneeId: req.user._id });
  
//     let details, idField, endDateField;
  
//     switch (flag) {
//       case "1":
//         idField = "projectId";
//         endDateField = "endDate";
//         details = await taskModel.find({ _id: taskIds, projectId: { $exists: true } })
//           .populate("projectId")
//           .sort({ createdAt: -1 })
//           .skip((parseInt(skip) - 1) * pageSize)
//           .limit(pageSize);
//         break;
  
//       case "2":
//         idField = "milestoneId";
//         endDateField = "completionDate";
//         details = await taskModel.find({ _id: taskIds, projectId: req.query.projectId, milestoneId: { $exists: true } })
//           .populate("milestoneId")
//           .sort({ createdAt: -1 })
//           .skip((parseInt(skip) - 1) * pageSize)
//           .limit(pageSize);
//         break;
  
//       case "3":
//         idField = "sprintId";
//         endDateField = "endDate";
//         details = await taskModel.find({ _id: taskIds, milestoneId: req.query.milestoneId, sprintId: { $exists: true } })
//           .populate("sprintId")
//           .sort({ createdAt: -1 })
//           .skip((parseInt(skip) - 1) * pageSize)
//           .limit(pageSize);
//         break;
  
//       default:
//         return res.status(400).json({ status: "400", message: "Invalid flag value" });
//     }
  
//     const uniqueDetails = [];

//     details.forEach(item => {
//       const existingItem = uniqueDetails.find(detail => detail[idField]._id.toString() === item[idField]._id.toString());
//       if (!existingItem) {
//         const endDate = item[idField][endDateField];
//         const daysLeft = calculateDaysLeft(endDate);
//         item[idField].daysLeft = daysLeft;
//         uniqueDetails.push(item);
//       }
//     });
  
//     const totalCount = uniqueDetails.length;
//     const totalPages = Math.ceil(totalCount / pageSize);
  
//     return res.status(200).json({
//       status: "200",
//       message: "Data Fetched Successfully",
//       response: uniqueDetails,
//       totalCount,
//       totalPages
//     });
//   } catch (error) {
//     return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
//   }
// };

// Get A Users All tasks Acc to status & Search tasks & List of tasks
const getUserTasks = async (req, res) => {
  try {
    var pageSize = 10;
    let now = new Date();
    let { flag, activeStatus, searchString, projectId, milestoneId, sprintId, skip } = req.query;
    const query = {
      projectId: new mongoose.Types.ObjectId(projectId),
      milestoneId: new mongoose.Types.ObjectId(milestoneId),
      sprintId: new mongoose.Types.ObjectId(sprintId),
    };
    const taskIds = await taskModel.distinct('_id', query);
    // Flag = 1 :- Tasks acc to Status, Flag = 2 :- List of tasks
    if (flag == 1) { activeStatus = true }

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
      {
        $lookup: {
          from: "tasks",
          let: { taskId: "$taskId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$taskId"] },
                    { $eq: ["$activeStatus", JSON.parse(activeStatus)] },
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
    const result = await assignUserModel.aggregate(queries);
    const totalCount = counts[0]?.totalCount
    const totalPages = Math.ceil(totalCount / pageSize);
    return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: result[0], totalCount, totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}
// All assignees of A project
const projectUserList = async (req, res) => {
  try {
    const { projectId, milestoneId, sprintId } = req.query;
    const taskfind = await taskModel.find({ projectId, milestoneId, sprintId });
    const taskIds = taskfind.map((task) => task._id);
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
      const assigneeId = assignee.assigneeId._id.toString();
      if (!uniqueAssigneesMap.has(assigneeId)) { uniqueAssigneesMap.set(assigneeId, true); uniqueAssignees.push(assignee) }
    });
    return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: uniqueAssignees });
  } catch (error) {
    return res.status(400).json({ status: "400", message: "Fill all the required fields", error: error.message });
  }
};

module.exports = { addUserAssignments, getUserAssignments, getUserTasks, projectUserList };
