const subTaskModel = require("../models/subTask.model");
const rolesModel = require("../models/role.model");
const { userHistory } = require('../controller/history.controller');

// create sub task or bug
const addSubTask = async (req, res) => {
    try {
        const { taskId, summary, description, priority, expectedHours, startDate, dueDate, assigneeId, parentId, reporterId, type } = req.body;
        const attachmentPath = req.file ? `${req.file.originalname}` : req.body.attachment;
        const fileExtension = req.file ? req.file.mimetype : undefined;
        const createSubTask = await subTaskModel.create({
            taskId, summary, description, priority, expectedHours, startDate, dueDate, parentId, reporterId, assigneeId, type,
            attachment: attachmentPath,
            attachmentType: fileExtension,
        });

        if (type === "Bug") {
            await userHistory(req, `Created Bug`);
            return res.status(200).json({ status: 200, message: "Bug added successfully", response: createSubTask })
        }
        else {
            await userHistory(req, `Created Sub Task`);
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
        const attachmentPath = req.file ? `${req.file.originalname}` : attachment;
        const fileExtension = req.file ? req.file.mimetype : undefined;
        const obj = {
            summary, description, priority, expectedHours, startDate, dueDate, status, type, assigneeId, reporterId,
            attachment: attachmentPath,
            attachmentType: fileExtension,
        };

        const existingSubTask = await subTaskModel.findById(subTaskId);
        if (existingSubTask.assigneeId !== assigneeId) {
            const assignee = await subTaskModel.findById(subTaskId);
            await userHistory(req, `Assignee ID changed`, assignee);
        }
        if (existingSubTask.reporterId !== reporterId) {
            const reporter = await subTaskModel.findById(subTaskId);
            await userHistory(req, `Reporter ID changed`, reporter);
        }
        const subTask = await subTaskModel.findById(subTaskId);
        await userHistory(req, subTask);
        await subTaskModel.findByIdAndUpdate(subTaskId, obj, { new: true });
        return res.status(200).json({ status: 200, message: "Sub Task updated successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};




// get sub Task list or bug list
const getSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId, type, page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        // const query = type && { type };
        let query = {};
        if (type === "SubTask" && taskId) {
            query = {
                type: "SubTask",
                taskId: taskId
            };
        } else if (type === "Bug" && taskId) {
            query = {
                type: "Bug",
                taskId: taskId
            };
        } else {
            return res.status(400).json({ status: 400, message: "Invalid request. Please provide valid type and taskId." });
        }

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
            const subTask = await subTaskId.findById(subTaskId)
            await subTaskModel.findByIdAndDelete({ _id: subTaskId });
            await userHistory(req, subTask);
            return res.status(200).json({ status: 200, message: "Sub task deleted successfully" });
        }
        if (bugId) {
            const bug = await subTaskId.findById(bugId)
            await subTaskModel.findByIdAndDelete({ _id: bugId, type: "Bug" });
            await userHistory(req, bug);
            return res.status(200).json({ status: 200, message: "Bug deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
}

// update Status of a task AND TimeTracking
const updateSubTaskStatus = async (req, res) => {
    try {
        if (Object.keys(req.body).length !== 0) {
            const { subTaskId, status } = req.body;
            const subTask = await subTaskModel.findById(subTaskId);

            let query = { status };
            if (status === 2) {
                if (status <= currentStatus && req.user.role !== 'Testing') {
                    return res.status(403).json({ status: "403", message: "You are not authorized to update the sub task status backwards." });
                }
                query.inProgressDate = new Date();
            }

            if (status === 4) {
                if (req.user.role === 'Testing') {
                    query.doneDate = new Date();
                    if (subTask && subTask.inProgressDate) {
                        let timeDifference = (query.doneDate.getTime() - subTask.inProgressDate.getTime());
                        query.timeTracker = timeDifference
                    }
                    if (subTask && subTask.logInTime && subTask.timeTracker) {
                        let timeDifference = (query.doneDate.getTime() - subTask.logInTime.getTime());
                        query.timeTracker = subTask.timeTracker + timeDifference
                    }
                }
                else {
                    return res.status(200).json({ status: "200", message: "You are not authorised to do so." });
                }
            }
            const result = await subTaskModel.findByIdAndUpdate({ _id: subTaskId }, query, { new: true });
            const taskStatus = await subTaskModel.findById(subTaskId)
            await userHistory(req, taskStatus);
            return res.status(200).json({ status: "200", message: "Sub Task Status updated successfully", data: result });
        } else {
            const subTasks = await subTaskModel.find({ assigneeId: req.user._id, status: 2 });
            if (subTasks.length > 0) {
                for (const subTask of subTasks) {
                    const updatedLogOutTime = await subTaskModel.findByIdAndUpdate(
                        { _id: subTask._id },
                        { $currentDate: { logOutTime: true } },
                        { new: true }
                    );

                    if (updatedLogOutTime) {
                        const subTaskDetails = await subTaskModel.findById(subTask._id);

                        if (subTaskDetails && subTaskDetails.logOutTime && subTaskDetails.inProgressDate) {
                            let timeDifference = subTaskDetails.logOutTime.getTime() - subTaskDetails.inProgressDate.getTime();
                            await subTaskModel.findByIdAndUpdate({ _id: subTask._id }, { timeTracker: timeDifference }, { new: true });
                        }

                        if (subTaskDetails && subTaskDetails.logInTime && subTaskDetails.logOutTime) {
                            let timeDifference = subTaskDetails.logOutTime.getTime() - subTaskDetails.logInTime.getTime();
                            await subTaskModel.findByIdAndUpdate({ _id: subTask._id }, { timeTracker: subTaskDetails.timeTracker + timeDifference }, { new: true });
                        }
                    }
                }
                await userHistory(req, "Updated Task");
                return res.status(200).json({ status: "200", message: "Sub tasks updated successfully" });
            }
            return res.status(200).json({ status: "200", message: "No tasks found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};

module.exports = {
    addSubTask,
    updateSubTask,
    getSubTask,
    deleteSubTask,
    updateSubTaskStatus
}