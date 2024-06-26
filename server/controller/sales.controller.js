const salesModel = require('../models/sales.model');
const { userHistory } = require('../controller/history.controller');

const createTask = async (req, res) => {
    try {
        const { taskDescription, assigneeId } = req.body;
        const result = await salesModel.create({ taskDescription, assigneeId });
        await userHistory(req,"Create Task");
        return res.status(200).json({ status: 200, message: "Task created successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

const getTasks = async (req, res) => {
    try {
        const result = await salesModel.find({ status: req.query.status }).populate({ path: 'assigneeId', select: 'firstName lastName' }).sort({ createdAt: -1 });
        return res.status(200).json({ status: 200, message: "Tasks fetched successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const salesId = req.body.salesId;
        const sales = await salesModel.findById(salesId)
        await salesModel.findByIdAndUpdate(salesId, req.body, { new: true });
        await userHistory(req,sales);
        return res.status(200).json({ status: 200, message: "Task updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}



module.exports = {
    createTask,
    getTasks,
    updateTask
}