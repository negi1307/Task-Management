const subTaskModel = require("../models/subTask.model");
const rolesModel = require("../models/role.model");
const { userHistory } = require('../controller/history.controller');

// create sub task or bug
const addSubTask = async (req, res) => {
    try {
        const { projectId, milestoneId, sprintId, summary, description, priority, expectedHours, startDate, dueDate, assigneeId, parentId, reporterId, type } = req.body;
        const lastTask = await subTaskModel.countDocuments();
        const createSubTask = await subTaskModel.create({ taskMannualId: lastTask + 1, projectId, milestoneId, sprintId, summary, description, priority, expectedHours, startDate, dueDate, parentId, reporterId, assigneeId, type });

        if (type === "Bug") {
            await userHistory(req, `Bug Created`);
            return res.status(200).json({ status: 200, message: "Bug added successfully", response: createSubTask })
        }
        else {
            await userHistory(req, `Sub Task Created `);
            return res.status(200).json({ status: 200, message: "Sub task added successfully", response: createSubTask })
        }

    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
}


// update sub task or bug
const updateSubTask = async (req, res) => {
    try {
        const { subTaskId, summary, description, priority, expectedHours, startDate, dueDate, status, assigneeId, reporterId, type } = req.body;
        const obj = { summary, description, priority, expectedHours, startDate, dueDate, status, type, assigneeId, reporterId };

        const existingSubTask = await subTaskModel.findById(subTaskId);
        if (existingSubTask.assigneeId !== assigneeId) {
            const assigneeChangeMessage = `Assignee ID changed`;
            await userHistory(req, assigneeChangeMessage);
        }
        if (existingSubTask.reporterId !== reporterId) {
            const reporterChangeMessage = `Reporter ID changed`;
            await userHistory(req, reporterChangeMessage);
        }
        await userHistory(req, `Sub Task updated`);
        await subTaskModel.findByIdAndUpdate(subTaskId, obj, { new: true });
        return res.status(200).json({ status: 200, message: "Sub Task updated successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};




// get sub Task list or bug list
const getSubTask = async (req, res) => {
    try {
        const { type, page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        const query = type && { type };

        const totalCount = await subTaskModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limitNumber);
        const skip = (pageNumber - 1) * limitNumber;

        const subTaskList = await subTaskModel.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limitNumber);

        const message = type === "Bug" ? "Bug list fetched successfully" : "Sub Task fetched successfully";

        return res.status(200).json({
            status: 200, message, response: subTaskList, currentPage: pageNumber, totalPages, totalItems: totalCount
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
}




// delete Sub task or bug
const deleteSubTask = async (req, res) => {
    try {
        const { subTaskId, bugId } = req.query;

        if (subTaskId) {
            await subTaskModel.findByIdAndDelete({ _id: subTaskId });
            await userHistory(req, `Delete Sub Task `);
            return res.status(200).json({ status: 200, message: "Sub task deleted successfully" });
        }
        if (bugId) {
            await subTaskModel.findByIdAndDelete({ _id: bugId, type: "Bug" });
            await userHistory(req, `Delete Bug `);
            return res.status(200).json({ status: 200, message: "Bug deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
}


module.exports = {
    addSubTask,
    updateSubTask,
    getSubTask,
    deleteSubTask,
}