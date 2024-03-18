const sprintModel = require('../models/sprint.model');
const { default: mongoose } = require('mongoose');
const { userHistory } = require('../controller/history.controller');

// Add a Sprint
const addSprint = async (req, res) => {
    try {
        const { projectId, milestoneId, sprintName, sprintDesc, startDate, endDate } = req.body;
        const existingSprintName = await sprintModel.findOne({
            sprintName: new RegExp(`^${sprintName.replace(/[\s]+/g, '\\s*')}\\s*$`, 'i'),
            milestoneId: milestoneId
        });
        if (existingSprintName) {
            return res.status(200).json({ status: '400', message: 'Sprint Name Already Exists' });
        } else {
            const result = await sprintModel.create({
                projectId,
                milestoneId,
                sprintName,
                sprintDesc,
                startDate,
                endDate
            });
            await userHistory(req, "Sprint Created");
            return res.status(200).json({ status: '200', message: 'Sprint Added Successfully', response: result });
        }
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

// Update a Sprint
const updateSprint = async (req, res) => {
    try {
        const sprintId = req.body.sprintId;
        const sprint = await sprintModel.findById(sprintId);
        await sprintModel.findByIdAndUpdate(sprintId, req.body, { new: true });
        await userHistory(req, sprint);
        return res.status(200).json({ status: '200', message: 'Sprint updated Successfully' });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

// Get Sprints of a milestone acc to filters
const getSprints = async (req, res) => {
    try {
        const { milestoneId, activeStatus, skip } = req.query;
        const pageSize = 10;
        const sprints = await sprintModel.aggregate([
            {
                $match: { milestoneId: new mongoose.Types.ObjectId(milestoneId), activeStatus: JSON.parse(activeStatus) }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: "$project" },
            {
                $lookup: {
                    from: "milestones",
                    localField: "milestoneId",
                    foreignField: "_id",
                    as: "milestone"
                }
            },
            { $unwind: "$milestone" },
            {
                $project: {
                    "project._id": 1,
                    "project.projectName": 1,
                    "milestone._id": 1,
                    "milestone.title": 1,
                    _id: 1,
                    sprintName: 1,
                    sprintDesc: 1,
                    startDate: 1,
                    endDate: 1,
                    activeStatus: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    daysLeft: {
                        $toInt: {
                            $max: [
                                0,
                                {
                                    $divide: [
                                        { $subtract: ["$endDate", "$startDate"] },
                                        1000 * 60 * 60 * 24,
                                    ]
                                }
                            ]
                        }
                    },
                }
            },
            { $sort: { daysLeft: 1 } },
            { $skip: (parseInt(skip) - 1) * pageSize },
            { $limit: pageSize }
        ]);
        const totalCount = await sprintModel.countDocuments({ milestoneId: milestoneId, activeStatus: activeStatus });
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ status: '200', message: 'Sprints Fetched Successfully', response: sprints, totalCount, totalPages });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong', error: error.message });
    }
}

module.exports = { addSprint, updateSprint, getSprints }


