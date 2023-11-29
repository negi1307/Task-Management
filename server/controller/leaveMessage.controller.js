const leaveMessageModel = require('../models/leaveMessage.model');

// Add a leave reason to a task
const addleaveReason = async (req, res) => {
    try {
        const result = await leaveMessageModel.create({
            leaveReason: req.body.leaveReason
        })
        return res.status(200).json({ status: "200", message: "Leave Reason added Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// Get A task's leaveReasons
const getLeaveReason = async (req, res) => {
    try {
        const result = await leaveMessageModel.find()
        return res.status(200).json({ status: "200", message: "Leave Reasons fetched Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

module.exports = { addleaveReason, getLeaveReason}