const historyModel = require('../models/history.model');

async function userHistory(req, userActivity) {
    try {
        let time = new Date();
        let userhistory = new historyModel({
            time: time,
            userActivity: userActivity,
            // user: req.user.firstName + req.user.lastName,
            userId: req.user._id,
            taskId: req.body.taskId,
            subTaskId: req.body.subTaskId,
            projectId: req.body.projectId,
            milestoneId: req.body.milestoneId,
            sprintId: req.body.sprintId,
            reporterId: req.user.reporterId,
            projectId: req.user.projectId,
            commentId: req.body.commentId,
            assigneeId: req.body.assigneeId,
        });
        await userhistory.save();
    } catch (error) {
        console.log(error.message);
    }
}




// Get History or recent activities
// const getHistory = async (req, res) => {
//     try {
//         const { taskId, projectId, subTaskId, milestoneId, sprintId, page, limit } = req.query;

//         const query = {};
//         if (taskId) query.taskId = taskId;
//         if (projectId) query.projectId = projectId;
//         if (subTaskId) query.subTaskId = subTaskId;
//         if (milestoneId) query.milestoneId = milestoneId;
//         if (sprintId) query.sprintId = sprintId;

//         const pageNumber = parseInt(page) || 1;
//         const limitNumber = parseInt(limit) || 10;

//         const startIndex = (pageNumber - 1) * limitNumber;

//         if (taskId) query.taskId = taskId;
//         if (projectId) query.projectId = projectId;
//         if (subTaskId) query.subTaskId = subTaskId;
//         if (milestoneId) query.milestoneId = milestoneId;
//         if (sprintId) query.sprintId = sprintId;

//         // const query = taskId ? { taskId } : {};

//         const result = await historyModel.find(query).populate('userId').populate('taskId').populate('subTaskId')
//         .populate('projectId').populate('milestoneId').populate('sprintId')
//         .populate('reporterId').populate('commentId').populate('assigneeId')
//         .skip(startIndex)
//         .limit(limitPerPage);
//         return res.status(200).json({ status: "200", message: "History fetched successfully", response: result });
//     } catch (error) {
//         return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
//     }
// };
const getHistory = async (req, res) => {
    try {
        const { taskId, projectId, subTaskId, milestoneId, sprintId, page, limit, skip } = req.query;

        const query = {};
        if (taskId) query.taskId = taskId;
        if (projectId) query.projectId = projectId;
        if (subTaskId) query.subTaskId = subTaskId;
        if (milestoneId) query.milestoneId = milestoneId;
        if (sprintId) query.sprintId = sprintId;

        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skipNumber = parseInt(skip) || 0;

        const startIndex = (pageNumber - 1) * limitNumber + skipNumber;

        // Count total documents without pagination
        const totalCount = await historyModel.countDocuments(query);

        const result = await historyModel.find(query)
            .populate('userId')
            .populate('taskId')
            .populate('subTaskId')
            .populate('projectId')
            .populate('milestoneId')
            .populate('sprintId')
            .populate('reporterId')
            .populate('commentId')
            .populate('assigneeId')
            .skip(startIndex)
            .limit(limitNumber);

        const totalPages = Math.ceil(totalCount / limitNumber);

        return res.status(200).json({
            status: "200",
            message: "History fetched successfully",
            response: result,
            totalDocuments: totalCount,
            totalPage: totalPages,
            currentPage: pageNumber,
            skip: startIndex,

        });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};



module.exports = { userHistory, getHistory }