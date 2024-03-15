const historyModel = require('../models/history.model');

async function userHistory(req, value) {
    try {
        let time = new Date();
        let userhistory = new historyModel({
            time: time,
            userActivity: value,
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
const getHistory = async (req, res) => {
    try {
        const taskId = req.query.taskId;
        const projectId = req.query.projectId;
        const subTaskId = req.query.subTaskId;
        const milestoneId = req.query.milestoneId;
        const sprintId = req.query.sprintId;

        const query = {};
        if (taskId) query.taskId = taskId;
        if (projectId) query.projectId = projectId;
        if (subTaskId) query.subTaskId = subTaskId;
        if (milestoneId) query.milestoneId = milestoneId;
        if (sprintId) query.sprintId = sprintId;

        // const query = taskId ? { taskId } : {};

        const result = await historyModel.find(query).populate('userId').populate('taskId').populate('subTaskId').populate('projectId').populate('milestoneId').populate('sprintId').populate('reporterId').populate('commentId').populate('assigneeId');
        return res.status(200).json({ status: "200", message: "History fetched successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};



module.exports = { userHistory, getHistory }