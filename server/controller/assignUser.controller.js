const { mongoose } = require('mongoose');
const assignUserModel = require('../models/assignUser.model');
const taskModel = require('../models/task.model');

// Assign the user
const addUserAssignments = async (req, res) => {
    try {
        const { projectId, milestoneId, sprintId, taskId, assigneeId, reporterId } = req.body;
        const query = {
            assigneeId: assigneeId // Always include assigneeId
        };
        // Add other fields to the query if they are present in the request body
        if (projectId) query.projectId = projectId;
        if (milestoneId) query.milestoneId = milestoneId;
        if (sprintId) query.sprintId = sprintId;
        if (taskId) query.taskId = taskId;
        if (reporterId) query.reporterId = reporterId;

        const alreadyAssigned = await assignUserModel.findOne(query);
        if (alreadyAssigned) {
            return res.status(200).json({ status: "400", message: `This ${projectId || milestoneId || sprintId || taskId} is already assigned to the User ${assigneeId}` })
        } else {
            const result = await assignUserModel.create({
                projectId,
                milestoneId,
                sprintId,
                taskId,
                assigneeId,
                reporterId
            });
            return res.status(200).json({ status: "200", message: "Assigned Successfully", response: result });
        }
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// Get User assignments
const getUserAssignments = async (req, res) => {
    try {
        const query = {
            assigneeId: req.query.assigneeId
        };
        if (req.query.flag == 1) {
            query.projectId = { $exists: true };
        } else if (req.query.flag == 2) {
            query.milestoneId = { $exists: true };
        } else if (req.query.flag == 3) {
            query.sprintId = { $exists: true };
        }
        const result = await assignUserModel.find(query).populate([
            { path: 'projectId', select: 'projectName' },
            { path: 'milestoneId', select: 'title' },
            { path: 'sprintId', select: 'sprintName' },
            { path: 'assigneeId', select: 'firstName lastName' },
            { path: 'reporterId', select: 'role' }
        ])
            .sort({ createdAt: -1 });
        return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: result })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// Get A Users All tasks Acc to status & Search tasks & List of tasks
const getUserTasks = async (req, res) => {
    try {
        var pageSize = 10;
        let now = new Date();
        let { flag, activeStatus, searchString, skip } = req.query;
        const query = {
            assigneeId: new mongoose.Types.ObjectId(req.user._id),
        };
        // Flag = 1 :- Tasks acc to Status, Flag = 2 :- List of tasks
        if (flag == 1) {
            activeStatus = true
        }
        const result = await assignUserModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assigneeId',
                    foreignField: '_id',
                    as: 'assigneeInfo',
                },
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'reporterId',
                    foreignField: '_id',
                    as: 'reporterInfo',
                },
            },
            {
                $lookup: {
                    from: 'tasks',
                    let: { taskId: '$taskId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$taskId'] },
                                        {
                                            $eq: ['$activeStatus', JSON.parse(activeStatus)]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                summary: {
                                    $regex: `.*${searchString.replace(/\s+/g, '\\s+')}.*`,
                                    $options: 'i'
                                }
                            }
                        }
                    ],
                    as: 'taskInfo'
                }
            },
            {
                $unwind: '$taskInfo'
            },
            {
                $unwind: '$assigneeInfo'
            },
            {
                $unwind: '$reporterInfo'
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (parseInt(skip) - 1) * pageSize
            },
            {
                $limit: pageSize
            },
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
                                then: '$$ROOT', // Push the entire document
                                else: null // Don't push if status is not "in progress"
                            }
                        }
                    },
                    Hold: {
                        $push: {
                            $cond: {
                                if: { $eq: ['$taskInfo.status', 3] },
                                then: '$$ROOT', // Push the entire document
                                else: null // Don't push if status is not "on hold"
                            }
                        }
                    },
                    Done: {
                        $push: {
                            $cond: {
                                if: { $eq: ['$taskInfo.status', 4] },
                                then: '$$ROOT', // Push the entire document
                                else: null // Don't push if status is not "done"
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
                                if: {
                                    $and: [
                                        { $lt: ['$taskInfo.dueDate', now] },
                                        { $ne: ['$taskInfo.status', 4] }
                                    ]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    },

                }
            } :
                {
                    $group: {
                        _id: 'all',
                        taskInfo: { $push: '$taskInfo' },
                        assigneeInfo: { $first: '$assigneeInfo' },
                        reporterInfo: { $first: '$reporterInfo' },
                        totalCount: { $sum: 1 }
                    }
                },
            {
                $match: {
                    "Todo": { $ne: [null] },
                    "Inprogress": { $ne: [null] },
                    "Hold": { $ne: [null] },
                    "Done": { $ne: [null] }
                }
            },
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
                        assigneeInfo: 1, 
                        reporterInfo: 1,
                        taskInfo: 1,
                        totalCount: 1
                    },
            },
        ]);
        const totalCount = result[0]?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: result, totalCount, totalPages });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

module.exports = { addUserAssignments, getUserAssignments, getUserTasks }