const mongoose = require('mongoose'), { Schema } = mongoose,

    historySchema = new Schema({
        time: {
            type: Date
        },
        userActivity: {
            type: Schema.Types.Mixed
        },
        userId: {
            type: Schema.Types.Mixed,
            // ref: 'User'
        },
        taskId: {
            type: Schema.Types.Mixed,
            // ref: 'Task'
        },
        commentId: {
            type: Schema.Types.Mixed,
            // ref: "Comment"
        },
        reporterId: {
            type: Schema.Types.Mixed,
            // ref: 'roles',
        },
        projectId: {
            type: Schema.Types.Mixed,
            // ref: 'projects'
        },
        milestoneId: {
            type: Schema.Types.Mixed,
            // ref: 'milestone'
        },
        sprintId: {
            type: Schema.Types.Mixed,
            // ref: 'sprint'
        },
        subTaskId: {
            type: Schema.Types.Mixed,
            // ref: 'subTask'
        },
        bugId: {
            type: Schema.Types.Mixed,
            // ref: 'subTask'
        },
        assigneeId: {
            type: Schema.Types.Mixed,
            // ref: 'User'
        }
    },
        {
            timestamps: true
        }
    )
module.exports = mongoose.model("History", historySchema);