const userModel = require("../models/users.model");
const assignUserModel = require("../models/assignUser.model");
const taskModel = require("../models/task.model");
const userLoginModel = require("../models/userLogin.model");
const nodemailer = require("../middleware/nodemailer");
const bcrypt = require("bcrypt");
const { accessToken } = require("../middleware/jwt.auth");

// Register a user or invite a user 
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if ((role === 'CTO' || role === 'PM') && (await userModel.findOne({ role }))) {
      return res.status(200).json({ status: "400", message: `${role} already exists` });
    }
    else {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(200).json({ status: "400", message: "Email already exists" });
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 9);
        const result = await userModel.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          plainPassword: password,
          role
        });
        if (result) {
          await nodemailer.emailSender(result);
          return res.status(200).json({ status: "200", message: "User created Successfully", response: result });
        }
        else {
          return res.status(200).json({ status: "400", message: 'User not created' });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// Log In of A User
const logInUser = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: { $regex: new RegExp('^' + req.body.email + '$') } });
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
      if (isPasswordValid) {
        const token = await accessToken(existingUser);
        const update = await updateTaskStatus(existingUser._id)
        if (update) {
          return res.status(200).json({ status: "200", message: "User logged in successfully", response: existingUser, token });
        }
      } else {
        return res.status(200).json({ status: "400", message: "Incorrect password" });
      }
    } else {
      return res.status(200).json({ status: "400", message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

async function updateTaskStatus(existingUser) {
  try {
    const taskIds = await assignUserModel.distinct('taskId', { assigneeId: existingUser._id });
    const tasks = await taskModel.find({ _id: { $in: taskIds }, status: 2 });
    for (const task of tasks) {
      await taskModel.updateOne({ _id: task._id }, { $currentDate: { logInTime: true } });
    }
    return true;
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    return false;
  }
}

// Get All Users
const getUsers = async (req, res) => {
  try {
    const result = await userModel.find({ role: { $ne: 'Admin' } }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "200", message: 'User data fetched successfully', response: result });
  } catch (error) {
    return res.status(500).json({ status: "500", message: 'Something went wrong' });
  }
}

// Delete A User
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete({ _id: req.query.userId });
    return res.status(200).json({ status: "200", message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong' })
  }
}

// Time tracking of users spend time
const trackTime = async (req, res) => {
  try {
    const userIds = await userModel.distinct('_id', { role: { $in: ['Employee', 'Sales'] } });
    console.log(userIds);
    const assignedTasksIds = await assignUserModel.distinct('taskId', { assigneeId: { $in: userIds } });
    console.log(assignedTasksIds);
    return res.send('okk')
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}




module.exports = {
  registerUser,
  logInUser,
  getUsers,
  deleteUser,
  trackTime
};