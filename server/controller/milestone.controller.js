const milestoneModel = require("../models/milestone.model");
const { userHistory } = require('../controller/history.controller');

// Add a Milestone
const addMilestone = async (req, res) => {
  try {
    const { projectId, title, description, startDate, completionDate } = req.body;
    const existingMilestoneTitle = await milestoneModel.findOne({
      title: new RegExp(`^${title.replace(/[\s]+/g, '\\s*')}\\s*$`, 'i'),
      projectId: projectId
    });
    if (existingMilestoneTitle) {
      return res.status(200).json({ status: "400", message: "Title Already Exists" });
    } else {
      const result = await milestoneModel.create({
        projectId,
        title,
        description,
        startDate,
        completionDate
      });
      await userHistory(req, "Created milestone");
      return res.status(200).json({ status: "200", message: "Milestone added Successfully", response: result });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Update a Milestone
const updateMilestone = async (req, res) => {
  try {
    await milestoneModel.findByIdAndUpdate({ _id: req.body.milestoneId }, req.body, { new: true });
    const milestoneData = await milestoneModel.findById({ _id: req.body.milestoneId })
    await userHistory(req, milestoneData);
    return res.status(200).json({ status: "200", message: "Milestone updated Successfully" });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// // Get all milestones And all milestones of a project
const getMilestones = async (req, res) => {
  try {
    const pageSize = 10;
    let milestones = await milestoneModel.find({ projectId: req.query.projectId, activeStatus: req.query.activeStatus }).sort({ createdAt: -1 }).skip((parseInt(req.query.skip) - 1) * pageSize).limit(pageSize);

    milestones = milestones.map(milestone => {
      const startDate = milestone.startDate;
      const completionDate = milestone.completionDate;
      const daysLeft = Math.ceil((completionDate - startDate) / (1000 * 60 * 60 * 24)); t
      return { ...milestone._doc, daysLeft };
    });

    const totalCount = await milestoneModel.countDocuments({ projectId: req.query.projectId, activeStatus: req.query.activeStatus });
    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({ status: "200", message: "Milestone Fetched Successfully", response: milestones, totalCount, totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}


module.exports = { addMilestone, updateMilestone, getMilestones };