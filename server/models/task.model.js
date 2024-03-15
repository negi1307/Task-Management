const mongoose = require('mongoose');

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
            type: String,// 1=High, 2=Medium, 3=Low , 4= Critical
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
            default: 1 // 1=,todo, 2=inProgress, 3=testing, 4=done 
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
        lastUpdaterId:{
            type :mongoose.Types.ObjectId,
            ref: 'User'
        }
    },
        {
            timestamps: true
        }
    )
);
module.exports = tasks;
