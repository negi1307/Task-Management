const historyModel = require('../models/history.model');

async function userHistory(req, res, next, value) {
    try {
        let time = new Date();
        let userhistory = await historyModel({
            time: time,
            userActivity: value,
            user: req.user.firstName + req.user.lastName,
            userId: req.user._id,
            taskId: req.body.taskId,
            reporterId: req.user.reporterId,
            projectId: req.user.projectId
        });
        await userhistory.save();
    } catch (error) {
        console.log(error.message);
    }
}




// Get History or recent activities
const getHistory = async (req, res) => {
    try {
        const result = await historyModel.find().populate('taskId', 'summary')
        return res.status(200).json({ status: "200", message: "History fetched sucessfully", response: result })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

module.exports = { userHistory, getHistory }