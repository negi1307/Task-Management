const projectModel = require("../models/project.model");
const { ObjectId } = require('mongodb');

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
      projectStatus,
    } = req.body;

    const projectNameRegex = new RegExp(`^${projectName}$`, "i");
    const existingProjectName = await projectModel.findOne({
      projectName: projectNameRegex,
    });
    if (existingProjectName) {
      return res.status(200).json({ status: "400", message: "Project Name Already exist" });
    } else {
      const result = await projectModel.create({
        projectName,
        clientName,
        technology,
        startDate,
        endDate,
        projectDesc,
        projectType,
        projectStatus,
      });
      return res.status(200).json({status: "200",message: "Project created successfully",response: result });
    }
  } catch (error) {
    return res.status(200).json({status: "500",message: "Something went wrong",error: error.message});
  }
};

// Get all Projects WRT status
// const getProjects = async (req, res) => {
//     try {
//         const pageSize = 10;
//         // const projectStatus = parseInt(req.query.projectStatus);
//         // if (projectStatus) {
//             if (parseInt(req.query.skip) === 0) {
//                 if (req.query.projectId) {
//                     const project = await projectModel.findById({ _id: req.query.projectId });
//                     return res.status(200).json({ status: '200', message: 'Project Details fetched successfully', response: project })
//                 } else {
//                     const projectStatus = parseInt(req.query.projectStatus);
//                     const projects = await projectModel.find({ activeStatus: req.query.activeStatus ,projectStatus}).populate('technology', 'techName')
//                         .sort({ createdAt: -1 })
//                     return res.status(200).json({ status: '200', message: 'Projects fetched successfully', response: projects })
//                 }
//             } else {
//                 const totalCount = await projectModel.countDocuments({ activeStatus: req.query.activeStatus,projectStatus});
//                 const projects = await projectModel.find({ activeStatus: req.query.activeStatus,projectStatus}).populate('technology', 'techName')
//                     .sort({ createdAt: -1 })
//                     .limit(pageSize)
//                     .skip((parseInt(req.query.skip) - 1) * pageSize);
//                 const totalPages = Math.ceil(totalCount / pageSize);

//                 return res.status(200).json({ status: '200', message: 'Projects fetched successfully', response: projects, totalCount, totalPages })
//             }
//         // }
//         // else{
//         //     res.status(200).json({status:201,message:"Invalid or missing projectStatus. It should be 1, 2,3 or 4"})
//         // }
//     } catch (error) {
//         return res.status(200).json({ status: '500', message: 'Something went wrong', error: error.message });
//     }
// }


const getProjects = async (req, res) => {
  try {
   let active;
          if (req.query.activeStatus == 1) { active= true}  
          else { active=false}
     const pageSize = 10;
  
   if(req.query.activeStatus && !req.query.skip && !req.query.projectId){
       const projects = await projectModel.aggregate([{$match:{activeStatus:JSON.parse(active)}},
        {
          $lookup: {
            from: "technologies",
            localField: "technology",
            foreignField: "_id",
            as: "technology",
          },
        },
        {
          $project: {
            "technology.techName": 1,
            "technology._id":1,
            projectName:1,
            clientName:1,
            activeStatus: 1,
            projectStatus: 1,
            projectType: 1,
            createdAt: 1,
            updatedAt: 1,
            startDate: 1,
            endDate: 1,
            daysLeft: {
              $divide: [
                { $subtract: ["$endDate", "$startDate"] }, 
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },{
          $sort: { startDate: 1 } 
        }
      ]);  
 
      return res.status(200).json({status: "200", message: "Project Details fetched successfully",response: projects});
     }
     const projectStatus = parseInt(req.query.projectStatus)
     const skip = parseInt(req.query.skip)
    if (skip === 0 && !projectStatus && !req.query.projectId && !req.query.activeStatus) {
      // If skip is 0 and all other fields are empty, send the whole data.
      // const projects = await projectModel.find().populate('technology', 'techName') .sort({ createdAt: -1 });
      const projects = await projectModel.aggregate([
        {
          $lookup: {
            from: "technologies",
            localField: "technology",
            foreignField: "_id",
            as: "technology",
          },
        },
        {
          $project: {
            "technology.techName": 1,
            "technology._id":1,
            projectName:1,
            clientName:1,
            activeStatus: 1,
            projectStatus: 1,
            projectType: 1,
            createdAt: 1,
            updatedAt: 1,
            startDate: 1,
            endDate: 1,
            daysLeft: {$divide: [{ $subtract: ["$endDate", "$startDate"] },1000 * 60 * 60 * 24]},
          },
        },
        {
          $sort: { startDate: 1 } 
        }
      ]);
      return res.status(200).json({status: "200",message: "Projects fetched successfully 1",response: projects});
    } else {
      if (parseInt(req.query.skip) === 0) {
        if (req.query.projectId) {
          // const project = await projectModel.findById({ _id: req.query.projectId });
          const project = await projectModel.aggregate([{$match:{_id:ObjectId(req.query.projectId) }},
            {
              $lookup: {
                from: "technologies",
                localField: "technology",
                foreignField: "_id",
                as: "technology",
              },
            },
            
            {
              $project: {
                "technology.techName": 1,
                "technology._id":1,
                projectName:1,
                clientName:1,
                activeStatus: 1,
                projectStatus: 1,
                projectType: 1,
                createdAt: 1,
                updatedAt: 1,
                startDate: 1,
                endDate: 1,
                daysLeft: {
                  $divide: [
                    { $subtract: ["$endDate", "$startDate"] }, // Calculate the difference in milliseconds
                    1000 * 60 * 60 * 24, // Convert milliseconds to days
                  ],
                },
              },
            },{
              $sort: { startDate: 1 } 
            }
          ]);
          return res.status(200).json({status: "200",message: "Project Details fetched successfully",response: project});
        } else {
          const projects = await projectModel.aggregate([
            { $match: { activeStatus: JSON.parse(req.query.activeStatus),projectStatus: parseInt(req.query.projectStatus) } },
            {
              $lookup: {
                from: "technologies",
                localField: "technology",
                foreignField: "_id",
                as: "technology",
              },
            },
            {
              $project: {
                "technology.techName": 1,
                "technology._id":1,
                projectName:1,
                clientName:1,
                activeStatus: 1,
                projectStatus: 1,
                projectType: 1,
                createdAt: 1,
                updatedAt: 1,
                startDate: 1,
                endDate: 1,
                daysLeft: {
                  $divide: [
                    { $subtract: ["$endDate", "$startDate"] }, // Calculate the difference in milliseconds
                    1000 * 60 * 60 * 24, // Convert milliseconds to days
                  ],
                },
              },
            },{
              $sort: { startDate: 1 } 
            }
          ])
          // const projects = await projectModel.find({ activeStatus: req.query.activeStatus, projectStatus }).populate('technology', 'techName')
          // .sort({ createdAt: -1 });
          return res.status(200).json({status: "200",message: "Projects fetched successfully",response: projects});
        }
      } else {
         let status=parseInt(req.query.projectStatus);
          const projects = await projectModel.aggregate([
            { $match: { activeStatus: JSON.parse(active),projectStatus:status} },
            {
              $lookup: {
                from: "technologies",
                localField: "technology",
                foreignField: "_id",
                as: "technology",
              },
            },
            {
              $project: {
                "technology.techName": 1,
                "technology._id":1,
                projectName:1,
                clientName:1,
                activeStatus: 1,
                projectStatus: 1,
                projectType: 1,
                createdAt: 1,
                updatedAt: 1,
                startDate: 1,
                endDate: 1,
                daysLeft: {
                  $divide: [
                    { $subtract: ["$endDate", "$startDate"] },
                    1000 * 60 * 60 * 24, // Convert milliseconds to days
                  ],
                },
              },
            },{
              $sort: { startDate: 1 } 
            }
          ])
          .sort({ createdAt: -1 })
          .limit(pageSize)
          .skip((skip - 1) * pageSize);
        const totalCount = await projectModel.countDocuments({activeStatus: req.query.activeStatus,projectStatus});
        // const projects = await projectModel
        //   .find({ activeStatus: req.query.activeStatus, projectStatus })
        //   .populate("technology", "techName")
        //   .sort({ createdAt: -1 })
        //   .limit(pageSize)
        //   .skip((skip - 1) * pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({status: "200",message: "Projects fetched successfully",response: projects,totalCount,totalPages});
      }
    }
  } catch (error) {
    return res.status(500).json({status: "500",message: "Something went wrong",error: error.message});
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate({ _id: req.body.projectId },req.body,{ new: true });
    return res.status(200).json({ status: "200", message: "Project updated successfully" });
  } catch (error) {
    return res.status(200).json({status: "500", message: "Something went wrong", error: error.message});
  }
};

// update A project ActiveStatus
const updateStatus = async (req, res) => {
    try {
        await projectModel.findByIdAndUpdate({ _id: req.body.projectId }, { activeStatus: req.body.activeStatus });
        return res.status(200).json({ status: '200', message: 'Project status updated Successfully' });
    } catch (error) {
        return res.status(200).json({ status: '500', message: 'Something went wrong', error: error.message })
    }
}



module.exports = { addProject, getProjects, updateProject, updateStatus };
