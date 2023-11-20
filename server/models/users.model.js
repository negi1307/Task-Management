const mongoose = require("mongoose");

const users = mongoose.model(
  'User', mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
    },
    roleId: {
      type: mongoose.Types.ObjectId,
      ref: 'roles'
    },
    role: {
      type: Number // 1-Admin, 2-Employee, 3-CTO, 4-PM, 5-Sales
    }
  },
    {
      timestamps: true,
    }
  )
);
module.exports = users;