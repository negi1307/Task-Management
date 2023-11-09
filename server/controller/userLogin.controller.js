const userLoginModel = require("../models/userLogin.model");
const userModel = require("../models/users.model")

// login time is save in the DB
const userLogin = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing in the token" });
        }
        const today = new Date();
        const existingRecord = await userLoginModel.findOne({userId: userId,loginDate: today });
        if (existingRecord) {
            existingRecord.loginTime = new Date();
            await existingRecord.save();
        } else {
            const newRecord = new userLoginModel({userId: userId,loginDate: today, loginTime: new Date()});
            await newRecord.save();
        }
        return res.status(200).json({ message: "Login time recorded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Server error" });
    }
};


// get the login records of the user
const loginTimeRecord = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing in the query parameters" });
        }
        const loginRecords = await userLoginModel.find({ userId: userId });
        if (loginRecords.length === 0) {
            return res.status(404).json({ message: "No login records found for the specified user" });
        }
        return res.status(200).json({ message: "Login records fetched successfully", loginRecords });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};






module.exports={userLogin,loginTimeRecord}
