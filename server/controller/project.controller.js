const projectModel = require("../models/project.model");

// Add a new Project
const addProject = async (req, res) => {
  try {
    const {
      projectName,
      clientName,
      technology,
      startDate,
      endDate,
      projectDesc,
      projectType,
    } = req.body;

    const projectNameRegex = new RegExp(`^${projectName}$`, "i");
    const existingProjectName = await projectModel.findOne({
      projectName: projectNameRegex,
    });
    if (existingProjectName) {
      return res
        .status(200)
        .json({ status: "400", message: "Project Name Already exist" });
    } else {
      const result = await projectModel.create({
        projectName,
        clientName,
        technology,
        startDate,
        endDate,
        projectDesc,
        projectType,
      });
      return res.status(200).json({
        status: "200",
        message: "Project created successfully",
        response: result,
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: "500",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get all Projects WRT status
const getProjects = async (req, res) => {
  try {
    const pageSize = 10;
    if (parseInt(req.query.skip) === 0) {
      if (req.query.projectId) {
        const project = await projectModel.findById({
          _id: req.query.projectId,
        });
        return res.status(200).json({
          status: "200",
          message: "Project Details fetched successfully",
          response: project,
        });
      } else {
        const projects = await projectModel
          .find({ activeStatus: req.query.activeStatus })
          .populate("technology", "techName")
          .sort({ createdAt: -1 });
        return res.status(200).json({
          status: "200",
          message: "Projects fetched successfully",
          response: projects,
        });
      }
    }
    // else if(){

    // }
    else {
      const totalCount = await projectModel.countDocuments({
        activeStatus: req.query.activeStatus,
      });
      const projects = await projectModel
        .find({ activeStatus: req.query.activeStatus })
        .populate("technology", "techName")
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip((parseInt(req.query.skip) - 1) * pageSize);
      const totalPages = Math.ceil(totalCount / pageSize);

      return res.status(200).json({
        status: "200",
        message: "Projects fetched successfully",
        response: projects,
        totalCount,
        totalPages,
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: "500",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate(
      { _id: req.body.projectId },
      req.body,
      { new: true }
    );
    return res
      .status(200)
      .json({ status: "200", message: "Project updated successfully" });
  } catch (error) {
    return res.status(200).json({
      status: "500",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// update A project ActiveStatus
const updateStatus = async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate(
      { _id: req.body.projectId },
      { activeStatus: req.body.activeStatus }
    );
    return res.status(200).json({
      status: "200",
      message: "Project Active InActive status updated Successfully",
    });
  } catch (error) {
    return res.status(200).json({
      status: "500",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { addProject, getProjects, updateProject, updateStatus };
