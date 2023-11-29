const mongoose = require('mongoose');

const assignUser = mongoose.model(
    'assignUser', mongoose.Schema({
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
        taskId: {
            type: mongoose.Types.ObjectId,
            ref: 'Task'
        },
        assigneeId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        reporterId: {
            type: mongoose.Types.ObjectId,
            ref: 'roles'
        }
    },
        {
            timestamps: true
        })
);
module.exports = assignUser;