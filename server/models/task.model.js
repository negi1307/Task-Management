const mongoose = require('mongoose');

const tasks = mongoose.model(
    'Task', mongoose.Schema({
        taskMannualId: {
            type: Number,
            required: true,
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
            type: Number,// 1=high, 2=medium, 3=low
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
        taskId:{
            type:mongoose.Types.ObjectId,
            ref:"Task"
        }
    },
        {
            timestamps: true
        }
    )
);
module.exports = tasks;
