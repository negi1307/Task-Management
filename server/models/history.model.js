const mongoose = require('mongoose'), { Schema } = mongoose,

    historySchema = new Schema({
        time: {
            type: Date
        },
        userActivity: {
            type: Schema.Types.Mixed
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles',
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'projects'
        },
        milestoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'milestone'
        },
        sprintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sprint'
        },
        subTaskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subTask'
        },
        bugId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subTask'
        },
        assigneeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
        {
            timestamps: true
        }
    )
module.exports = mongoose.model("History", historySchema);