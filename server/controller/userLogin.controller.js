const userLoginModel = require("../models/userLogin.model");

// login time is save in the DB
const userLogin = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const existingRecord = await userLoginModel.findOne({ userId: userId, loginDate: today });
        let loginRecord;
        if (existingRecord) {
            existingRecord.loginTime = new Date();
            await existingRecord.save();
            loginRecord = existingRecord;
        } else {
            const newRecord = new userLoginModel({ userId: userId, loginDate: today, loginTime: new Date() });
            loginRecord = await newRecord.save();
        }
        const response = {
            status: 200,
            message: "Login time recorded successfully",
            loginTime: loginRecord.loginTime,
        };
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Server error" });
    }
};


// // update the stop time
// const recordStopTime = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const mostRecentRecord = await userLoginModel.findOne({ userId: userId }, {}, { sort: { createdAt: -1 } });
//         if (mostRecentRecord) {
//             mostRecentRecord.logoutTime = new Date();
//             await mostRecentRecord.save();
//             return res.status(200).json({ status: 200, message: "Logout time updated successfully", logoutTime: mostRecentRecord });
//         } else {
//             return res.status(404).json({ status: 404, message: "No record found to update logout time" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 500, message: "Server error" });
//     }
// };

const recordStopTime = async (req, res) => {
    try {
        const userId = req.user._id;
        const { leaveMessageId } = req.body;
        const mostRecentRecord = await userLoginModel.findOne({ userId: userId }, {}, { sort: { createdAt: -1 } });

        if (mostRecentRecord) {
            const logoutTime = new Date();
            const logoutTimeDiff = logoutTime - mostRecentRecord.createdAt;
            mostRecentRecord.logoutTime = logoutTime;

            if (logoutTimeDiff < 9 * 60 * 60 * 1000) {
                // If logout is within 9 hours, check if leaveMessageId is provided
                if (leaveMessageId) {
                    // If leaveMessageId is provided by the frontend, use it
                    mostRecentRecord.leaveMessageId = leaveMessageId;
                } else {
                    // If leaveMessageId is not provided, respond with a message indicating that a reason is required
                    return res.status(400).json({
                        status: 400,
                        message: "A reason for leaving early is required",
                    });
                }
            } else {
                // If logout is after 9 hours, set leaveMessageId to "defaultId"
                mostRecentRecord.leaveMessageId = "defaultId";
            }

            // Save the updated record in the database
            await mostRecentRecord.save();

            // Respond with a success message and the updated record
            return res.status(200).json({
                status: 200,
                message: "Logout time and leave message updated successfully",
                logoutTime: mostRecentRecord.logoutTime,
                leaveMessageId: mostRecentRecord.leaveMessageId,
            });
        } else {
            // If no record is found, respond with a 404 status and message
            return res.status(404).json({ status: 404, message: "No record found to update logout time" });
        }
    } catch (error) {
        // Handle any errors and respond with a 500 status and message
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
        const loginRecords = await userLoginModel
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
