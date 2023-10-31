const userModel = require("../models/users.model");
const nodemailer = require("../middleware/nodemailer");
const bcrypt = require("bcrypt");
const { accessToken } = require("../middleware/jwt.auth");

// Register a user or invite a user 
const registerUser = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).json({ status: "400", message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 9);
    const result = await userModel.create({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      plainPassword: req.body.password,
      roleId: req.body.roleId,
      role: 2
    });
    if (result) {
      await nodemailer.emailSender(result);
      return res.status(200).json({ status: "200", message: "User created Successfully", response: result });
    } else {
      return res.status(400).json({ status: "400", message: 'User not created' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "500", message: "Something went wrong" });
  }
}

// LognIn of A User
const logInUser = async (req, res) => {
  try {
    let existingUser;
    if (req.body.email) {
      existingUser = await userModel.findOne({ email: req.body.email, role: 1 }).populate('roleId')
    }
    if (!existingUser && req.body.email) {
      existingUser = await userModel.findOne({ email: req.body.email, role: 2 }).populate('roleId')
    }
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
      if (isPasswordValid) {
        const token = await accessToken(existingUser);
        return res.status(200).json({ status: "200", message: "User logged in successfully", response: existingUser, token });
      } else {
        return res.status(200).json({ status: "400", message: "Incorrect password" });
      }
    } else {
      return res.status(200).json({ status: "400", message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const result = await userModel.find({ role: 2 }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "200", message: 'User data fetched successfully', response: result });
  } catch (error) {
    return res.status(200).json({ status: "500", message: 'Something went wrong' });
  }
}

// Delete A User
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete({ _id: req.query.userId });
    return res.status(200).json({ status: "200", message: 'User deleted successfully' });
  } catch (error) {
    return res.status(200).json({ status: '500', message: 'Something went wrong' })
  }
}

module.exports = {
  getUsers, registerUser, logInUser, deleteUser
};