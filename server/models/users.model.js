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
    role: {
      type: String,
      enum: ['Admin', 'Employee', 'Sales', 'PM', 'CTO']
    }
  },
    {
      timestamps: true,
    }
  )
);
module.exports = users;