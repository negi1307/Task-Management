const mongoose = require('mongoose'), { Schema } = mongoose,

    // const HistoryTypeEnum = {
    //     // Define your enum values here
    //     // For example:
    //     CREATED: 'created',
    //     UPDATED: 'updated',
    //     DELETED: 'deleted',
    // };

    historySchema = new Schema({
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
        // user: {
        //     type: String
        // },
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
        milestoneId: {
            type: mongoose.Types.ObjectId,
            ref: 'milestones'
        },
        sprintId: {
            type: mongoose.Types.ObjectId,
            ref: 'sprints'
        },
        subTaskId:{
            type:mongoose.Types.ObjectId,
            ref:'subtasks'
        },
        bugId:{
            type:mongoose.Types.ObjectId,
            ref:'subtasks'
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
module.exports = mongoose.model("History", historySchema);