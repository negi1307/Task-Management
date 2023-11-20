const userLoginModel = require("../models/userLogin.model");

// login time is save in the DB
const userLogin = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const existingRecord = await userLoginModel.findOne({
      userId: userId,
      loginDate: today,
    });
    if (existingRecord) {
      existingRecord.loginTime = new Date();
      await existingRecord.save();
    } else {
      const newRecord = new userLoginModel({
        userId: userId,
        loginDate: today,
        loginTime: new Date(),
      });
      await newRecord.save();
    }
    return res
      .status(200)
      .json({ status: 200, message: "Login time recorded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: 400, message: "Server error" });
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
//             return res.status(200).json({ status: 200, message: "Logout time updated successfully", mostRecentRecord });
//         } else {
//             return res.status(404).json({ status: 404, message: "No record found to update logout time" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 500, message: "Server error" });
//     }
// };



// get the login records of the user
const loginTimeRecord = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res
        .status(200)
        .json({
          status: 400,
          message: "User ID is missing in the query parameters",
        });
    }
    const loginRecords = await userLoginModel
      .find({ userId: userId })
      .populate("userId");
    if (loginRecords.length === 0) {
      return res
        .status(200)
        .json({
          status: 404,
          message: "No login records found for the specified user",
        });
    }
    return res
      .status(200)
      .json({
        status: 200,
        message: "Login records fetched successfully",
        loginRecords,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};


module.exports = {
    userLogin,
    // recordStopTime,
    loginTimeRecord
}
