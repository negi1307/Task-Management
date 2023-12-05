const commentsModel = require('../models/comments.model');
const { userHistory } = require("../controller/history.controller");

// Add a Comment to a task
const addComment = async (req, res) => {
    try {
        const result = await commentsModel.create({
            taskId: req.body.taskId,
            userId: req.user._id,
            comment: req.body.comment
        });
        const userActivity = `Comment added `;
        await userHistory(req, userActivity);
        return res.status(200).json({ status: "200", message: "Comment added Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};



// Get A task's Comments
const getTaskComment = async (req, res) => {
    try {
        // const userActivity = "Comments fetched for taskId: " + req.query.taskId;
        // await userHistory(req, userActivity);
        const result = await commentsModel.find({ taskId: req.query.taskId }).populate('userId', 'firstName lastName')
        return res.status(200).json({ status: "200", message: "Comments fetched Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// Update the Comment 
const updateComment = async (req, res) => {
    try {
        const userActivity = "Update the Comment";
        const taskId = req.body.taskId;
        const commentId = req.body.commentId;
        await userHistory(req, userActivity, taskId, commentId);
        const updatedComment = await commentsModel.findByIdAndUpdate({ _id: commentId, taskId: taskId },req.body,{ new: true });
        if (!updatedComment) {
            return res.status(404).json({ status: "404", message: "Comment not found" });
        }
        return res.status(200).json({ status: "200", message: "Comment updated successfully", response: updatedComment });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};


// delete a Comment
const deleteComment = async (req, res) => {
    try {
        const userActivity = "Delete the Comment";
        await userHistory(req, userActivity);
        await commentsModel.findByIdAndDelete({ _id: req.query.commentId });
        return res.status(200).json({ status: "200", message: "Comment deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

module.exports = { addComment, getTaskComment, updateComment, deleteComment }