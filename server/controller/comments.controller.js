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
        await userHistory(req, `Comment added`);
        return res.status(200).json({ status: "200", message: "Comment added Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};

// Get A task's Comments
const getTaskComment = async (req, res) => {
    try {
        const result = await commentsModel.find({ taskId: req.query.taskId }).populate('userId', 'firstName lastName')
        return res.status(200).json({ status: "200", message: "Comments fetched Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// Update the Comment 
const updateComment = async (req, res) => {
    console.log(req.body)
    try {
        const { commentId, comment } = req.body;
        const currentComment = await commentsModel.findById(commentId)
        await userHistory(req, currentComment);
        await commentsModel.findByIdAndUpdate({ _id: commentId }, { comment }, { new: true });
        return res.status(200).json({ status: "200", message: "Comment updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};


// delete a Comment
const deleteComment = async (req, res) => {
    try {
        const commentId = req.query.commentId;
        const comment = await commentsModel.findById(commentId);
        await userHistory(req, comment);
        await commentsModel.findByIdAndDelete({ _id: req.query.commentId });
        return res.status(200).json({ status: "200", message: "Comment deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

module.exports = { addComment, getTaskComment, updateComment, deleteComment }