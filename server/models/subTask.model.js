const mongoose = require('mongoose');
const users = require('./users.model');

const subTask = mongoose.model(
    'subTask', mongoose.Schema({
        taskId: {
            type: mongoose.Types.ObjectId,
            required: true,
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
            default: 1 // 1=,todo, 2=inProgress,3=testing,4=done, 5=hold
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
            type: String,
            enum: ['Bug', 'SubTask']
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
        {
            timestamps: true
        }
    )
);
module.exports = subTask;
