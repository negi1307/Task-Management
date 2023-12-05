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
        const query = taskId ? { taskId } : {};
        const result = await historyModel.find(query).populate('userId');
        return res.status(200).json({ status: "200", message: "History fetched successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};




module.exports = { userHistory, getHistory }