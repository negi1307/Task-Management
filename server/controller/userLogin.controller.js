const userLoginModel = require("../models/userLogin.model");

// login time is save in the DB
const userLogin = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is missing in the token" });
        }
        const today = new Date();
        const existingRecord = await userLoginModel.findOne({ userId: userId, loginDate: today, logoutDate: today });
        if (existingRecord) {
            existingRecord.loginTime = new Date();
            existingRecord.logoutTime = new Date();
            await existingRecord.save();
        } else {
            const newRecord = new userLoginModel({ userId: userId, loginDate: today, loginTime: new Date() });
            await newRecord.save();
        }
        return res.status(200).json({ status: 200, message: "Login time recorded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: 400, message: "Server error" });
    }
};

// const userLogin = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         if (!userId) {
//             return res.status(400).json({ status: 400, message: "User ID is missing in the token" });
//         }

//         const today = new Date();
//         let existingRecord = await userLoginModel.findOne({ userId: userId, loginDate: today });

//         if (existingRecord) {
//             // If an existing record is found for today
//             if (existingRecord.loginTime && !existingRecord.logoutTime) {
//                 // If loginTime is already recorded but logoutTime is not, update logoutTime
//                 existingRecord.logoutTime = new Date();
//             } else {
//                 // If both loginTime and logoutTime are already recorded, create a new record
//                 existingRecord = new userLoginModel({ userId: userId, loginDate: today, loginTime: new Date() });
//             }
//         } else {
//             // If no existing record is found for today, create a new record with loginTime
//             existingRecord = new userLoginModel({ userId: userId, loginDate: today, loginTime: new Date() });
//         }

//         await existingRecord.save();
//         const message = existingRecord.logoutTime ? "Logout time recorded successfully" : "Login time recorded successfully";

//         return res.status(200).json({ status: 200, message: message });
//     } catch (error) {
//         console.error(error);
//         return res.status(400).json({ status: 400, message: "Server error" });
//     }
// };







// get the login records of the user
const loginTimeRecord = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(200).json({ status: 400, message: "User ID is missing in the query parameters" });
        }
        const loginRecords = await userLoginModel.find({ userId: userId }).populate("userId")
        if (loginRecords.length === 0) {
            return res.status(200).json({ status: 404, message: "No login records found for the specified user" });
        }
        return res.status(200).json({ status: 200, message: "Login records fetched successfully", loginRecords });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Server error" });
    }
};






module.exports = { userLogin, loginTimeRecord }
