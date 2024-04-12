const breakTimeModel = require("../models/userLogin.model");

// login time is save in the DB
const userLogin = async (req, res) => {
    try {
        const userId = req.user._id;
        const taskId = req.body.taskId;
        const today = new Date();
        const newRecord = new breakTimeModel({ userId: userId, loginDate: today, startTime: today, taskId: taskId });
        loginRecord = await newRecord.save();
        return res.status(200).json({ status: 200, message: "Start time recorded successfully", response: newRecord });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


// update the stop time
const recordStopTime = async (req, res) => {
    try {
        const userId = req.user._id;
        const mostRecentRecord = await breakTimeModel.findOne({ userId: userId, stopTime: { $exists: false } }, {}, { sort: { createdAt: -1 } });

        if (mostRecentRecord) {
            const startTime = mostRecentRecord.startTime;
            const stopTime = new Date();
            const timeDifference = stopTime.getTime() - startTime.getTime();
            const breakInSeconds = Math.round(timeDifference / 1000);
            mostRecentRecord.stopTime = stopTime;
            mostRecentRecord.break = breakInSeconds;

            await mostRecentRecord.save();
            return res.status(200).json({ status: 200, message: "Logout time updated successfully", response: mostRecentRecord });
        } else {
            return res.status(404).json({ status: 404, message: "No record found to update logout time" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error" });
    }
};


// get the login records of the user
const loginTimeRecord = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(200).json({ status: 400, message: "User ID is missing in the query parameters" });
        }
        const loginRecords = await breakTimeModel
            .find({ userId: userId })
            .populate("userId");
        if (loginRecords.length === 0) {
            return res.status(200).json({ status: 404, message: "No login records found for the specified user" });
        }
        return res.status(200).json({ status: 200, message: "Login records fetched successfully", data: loginRecords });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error" });
    }
};


module.exports = {
    userLogin,
    recordStopTime,
    loginTimeRecord
}
