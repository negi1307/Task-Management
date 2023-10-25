const sprintModel = require('../models/sprint.model');

// Add a Sprint
const addSprint = async (req, res) => {
    try {
        const { projectId, milestoneId, sprintName, sprintDesc, startDate, endDate } = req.body;

        const existingSprintName = await sprintModel.findOne({ sprintName: sprintName });
        if (existingSprintName) {
            return res.status(200).json({ status: '400', message: 'Sprint Name already existed' });
        } else {
            const result = await sprintModel.create({
                projectId,
                milestoneId,
                sprintName,
                sprintDesc,
                startDate,
                endDate
            });
            return res.status(200).json({ status: '200', message: 'Sprint Added Successfully', response: result });
        }
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

// Update a Sprint
const updateSprint = async (req, res) => {
    try {
        await sprintModel.findByIdAndUpdate({ _id: req.body.sprintId }, req.body, { new: true });
        return res.status(200).json({ status: '200', message: 'Sprint updated Successfully' });
    } catch (error) {
        return res.status(200).json({ status: '404', message: 'Something went wrong' });
    }
}

// update sprint status
const updateStatus = async (req, res) => {
    try {
        await sprintModel.findByIdAndUpdate({ _id: req.body.sprintId }, { activeStatus: req.body.activeStatus })
        return res.status(200).json({ status: '200', message: 'Sprint status updated Successfully' });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

// To get all sprints of a milestone
const getAMilestoneAllSprints = async (req, res) => {
    try {
        const pageSize = 10;
        if (parseInt(req.query.skip) === 0) {
            if (req.query.milestoneId) {
                const milestones = await sprintModel.find({ activeStatus: req.query.activeStatus, milestoneId: req.query.milestoneId }).populate('projectId', 'projectName')
                    .sort({ createdAt: -1 })
                return res.status(200).json({ status: '200', message: 'Milestones Data fetched successfully', response: milestones })
            }
            else {
                const sprints = await sprintModel.find({ activeStatus: req.query.activeStatus }).populate([
                    { path: 'projectId', select: 'projectName' },
                    { path: 'milestoneId', select: 'title' },
                ])
                    .sort({ createdAt: -1 });
                return res.status(200).json({ status: '200', message: 'Sprints Data fetched successfully', response: sprints });
            }
        }
        else {
            const totalCount = await sprintModel.countDocuments({ $and: [{ milestoneId: req.query.milestoneId }, { activeStatus: req.query.activeStatus }] })
            const result = await sprintModel.find({ $and: [{ milestoneId: req.query.milestoneId }, { activeStatus: req.query.activeStatus }] }).populate([
                { path: 'projectId', select: 'projectName' },
                { path: 'milestoneId', select: 'title' },
            ])
                .sort({ createdAt: -1 })
                .limit(pageSize)
                .skip((parseInt(req.query.skip) - 1) * pageSize);
            const totalPages = Math.ceil(totalCount / pageSize);

            return res.status(200).json({ status: '200', message: "ALL sprints fecteched successfully", Response: result, totalCount, totalPages })

        }
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

module.exports = { addSprint, updateSprint, updateStatus, getAMilestoneAllSprints }
