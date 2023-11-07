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
            assigneeId: req.user._id
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

// Get A Users All tasks &  Search tasks
const getUserTasks = async (req, res) => {
    try {
        let { projectId, milestoneId, sprintId, searchString } = req.query;
        let todo = [];
        let inProgress = [];
        let hold = [];
        let done = [];
        const query = {
            assigneeId: new mongoose.Types.ObjectId(req.user._id)
        };
        if (projectId && milestoneId && sprintId) {
            const taskfind = await taskModel.find({ projectId, milestoneId, sprintId })
            const taskIds = taskfind.map(id => {
                return id._id
            })
            query.taskId = { $in: taskIds }
        }
        const result = await assignUserModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'taskId',
                    foreignField: '_id',
                    as: 'taskDetail'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'taskDetail.projectId',
                    foreignField: '_id',
                    as: 'projectDetail'
                }
            },
            {
                $lookup: {
                    from: 'milestones',
                    localField: 'taskDetail.milestoneId',
                    foreignField: '_id',
                    as: 'milestoneDetail',
                },
            },
            {
                $lookup: {
                    from: 'sprints',
                    localField: 'taskDetail.sprintId',
                    foreignField: '_id',
                    as: 'sprintDetail',
                },
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
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'taskId',
                    as: 'comments',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    projectInfo: { $first: { $arrayElemAt: ['$projectDetail', 0] } },
                    milestoneInfo: { $first: { $arrayElemAt: ['$milestoneDetail', 0] } },
                    sprintInfo: { $first: { $arrayElemAt: ['$sprintDetail', 0] } },
                    taskInfo: { $first: { $arrayElemAt: ['$taskDetail', 0] } },
                    assigneeInfo: { $first: { $arrayElemAt: ['$assigneeInfo', 0] } },
                    reporterInfo: { $first: { $arrayElemAt: ['$reporterInfo', 0] } },
                    comments: { $first: { $arrayElemAt: [['$comments'], 0] } },
                }
            }
        ])
            .sort({ createdAt: -1 });
        for (const assignment of result) {
            const summary = assignment?.taskInfo?.summary;
            if (new RegExp(searchString, 'i').test(summary)) {
                if (assignment?.taskInfo?.status === 1) {
                    todo.push(assignment);
                } else if (assignment?.taskInfo?.status === 2) {
                    inProgress.push(assignment);
                } else if (assignment?.taskInfo?.status === 3) {
                    hold.push(assignment);
                } else if (assignment?.taskInfo?.status === 4) {
                    done.push(assignment);
                }
            }
        }
        return res.status(200).json({
            status: "200",
            message: "Data Fetched Successfully",
            todo: { tasks: todo, taskCount: todo.length },
            inProgress: { tasks: inProgress, taskCount: inProgress.length },
            hold: { tasks: hold, taskCount: hold.length },
            done: { tasks: done, taskCount: done.length }
        });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// All assignees of A project
const projectUserList = async (req, res) => {
    try {
        const taskfind = await taskModel.find({ projectId: req.query.projectId });
        const taskIds = taskfind.map(task => task._id);
        const assignees = await assignUserModel
        .find({ taskId: { $in: taskIds } })
        .populate([
            { path: 'assigneeId', select: 'firstName lastName' },
            { path: 'reporterId', select: 'role' }
        ])
        .populate("taskId");
        return res.status(200).json({ status: "200", message: "Data Fetched Successfully", response: assignees })
    } 
    catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    };
}




module.exports = { addUserAssignments,/* getUserAssignment,*/ getUserAssignments, getUserTasks,projectUserList }