const mongoose = require('mongoose');
const techCategory = require('./techCategory.model');

const tasks = mongoose.model(
    'Task', mongoose.Schema({
        taskMannualId: {
            type: Number,
            // required: true,
        },
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'projects'
        },
        milestoneId: {
            type: mongoose.Types.ObjectId,
            ref: 'milestone'
        },
        sprintId: {
            type: mongoose.Types.ObjectId,
            ref: 'sprint'
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
            default: 1 // 1=,todo, 2=inProgress, 3=testing, 4=done, 5=hold
        },
        inProgressDate: {
            type: Date
        },
        doneDate: {
            type: Date
        },
        timeTracker: {
            type: String
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
        taskId: {
            type: mongoose.Types.ObjectId,
            ref: "Task"
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
            ref: 'User'
        },
        lastUpdaterId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        label: {
            type: mongoose.Types.ObjectId,
            ref:'techCategory'
        }
    },
        {
            timestamps: true
        }
    )
);
module.exports = tasks;
