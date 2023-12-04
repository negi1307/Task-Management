const mongoose = require('mongoose');

const HistoryTypeEnum = {
    // Define your enum values here
    // For example:
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted',
};

const history = mongoose.model(
    'History', mongoose.Schema({
        // type: {
        //     type: String,
        //     enum: Object.values(HistoryTypeEnum),
        //     required: true,
        // },
        time: {
            type: Date
        },
        userActivity: {
            type: String
        },
        user: {
            type: String
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        taskId: {
            type: mongoose.Types.ObjectId,
            ref: 'Task'
        },
        commentId: {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        },
        reporterId: {
            type: mongoose.Types.ObjectId,
            ref: 'roles',
        },
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'projects'
        },
        assigneeId: {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        } 
    },
        {
            timestamps: true
        }
    )
);
module.exports = history;