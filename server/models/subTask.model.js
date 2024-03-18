const mongoose = require('mongoose');

const subTask = mongoose.model(
    'subTask', mongoose.Schema({
        taskId: {
            type: mongoose.Types.ObjectId,
            ref: "Task"
        },
        summary: {
            type: String
        },
        description: {
            type: String
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low', 'Critical']
        },
        expectedHours: {
            type: Number
        },
        startDate: {
            type: Date
        },
        dueDate: {
            type: Date
        },
        status: {
            type: Number,
            default: 1 // 1=,todo, 2=inProgress, 3=hold, 4=done 
        },
        inProgressDate: {
            type: Date
        },
        doneDate: {
            type: Date
        },
        timeTracker: {
            type: Number
        },
        activeStatus: {
            type: Boolean,
            default: true
        },
        attachment: {
            type: String
        },
        attachmentType: {
            type: String
        },
        logInTime: {
            type: Date
        },
        logOutTime: {
            type: Date
        },
        assigneeId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        reporterId: {
            type: mongoose.Types.ObjectId,
            ref: 'roles'
        },
        type: {
            type: String, //Bug,SubTask
        }
    },
        {
            timestamps: true
        }
    )
);
module.exports = subTask;
