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
      enum: ['Admin', 'Employee', 'CTO', 'PM', 'Sales', 'Testing']
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "techCategory"
    },
    technologyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technology"
    }
  },
    {
      timestamps: true,
    }
  )
);
module.exports = users;