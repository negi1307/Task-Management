const projectModel = require("../models/project.model");
const { ObjectId } = require('mongodb');
const projectupload=require('../models/projectupload.model');
const path = require('path');
 
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
      return res.status(200).json({ status: "200", message: "Project created successfully", response: result });
    }
  } catch (error) {
    return res.status(200).json({ status: "500", message: "Something went wrong", error: error.message });
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
    if (req.query.activeStatus == 1) { active = true }
    else { active = false }
    const pageSize = 10;

    if (req.query.activeStatus && !req.query.skip && !req.query.projectId) {
      const projects = await projectModel.aggregate([{ $match: { activeStatus: JSON.parse(active) } },
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
          "technology._id": 1,
          projectName: 1,
          clientName: 1,
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
      }, {
        $sort: { startDate: 1 }
      }
      ]);

      return res.status(200).json({ status: "200", message: "Project Details fetched successfully", response: projects });
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
            "technology._id": 1,
            projectName: 1,
            clientName: 1,
            activeStatus: 1,
            projectStatus: 1,
            projectType: 1,
            createdAt: 1,
            updatedAt: 1,
            startDate: 1,
            endDate: 1,
            daysLeft: { $divide: [{ $subtract: ["$endDate", "$startDate"] }, 1000 * 60 * 60 * 24] },
          },
        },
        {
          $sort: { startDate: 1 }
        }
      ]);
      return res.status(200).json({ status: "200", message: "Projects fetched successfully 1", response: projects });
    } else {
      if (parseInt(req.query.skip) === 0) {
        if (req.query.projectId) {
          // const project = await projectModel.findById({ _id: req.query.projectId });
          const project = await projectModel.aggregate([{ $match: { _id: ObjectId(req.query.projectId) } },
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
              "technology._id": 1,
              projectName: 1,
              clientName: 1,
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
          }, {
            $sort: { startDate: 1 }
          }
          ]);
          return res.status(200).json({ status: "200", message: "Project Details fetched successfully", response: project });
        } else {
          const projects = await projectModel.aggregate([
            { $match: { activeStatus: JSON.parse(req.query.activeStatus), projectStatus: parseInt(req.query.projectStatus) } },
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
                "technology._id": 1,
                projectName: 1,
                clientName: 1,
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
            }, {
              $sort: { startDate: 1 }
            }
          ])
          // const projects = await projectModel.find({ activeStatus: req.query.activeStatus, projectStatus }).populate('technology', 'techName')
          // .sort({ createdAt: -1 });
          return res.status(200).json({ status: "200", message: "Projects fetched successfully", response: projects });
        }
      } else {
        let status = parseInt(req.query.projectStatus);
        const projects = await projectModel.aggregate([
          { $match: { activeStatus: JSON.parse(active), projectStatus: status } },
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
              "technology._id": 1,
              projectName: 1,
              clientName: 1,
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
          }, {
            $sort: { startDate: 1 }
          }
        ])
          .sort({ createdAt: -1 })
          .limit(pageSize)
          .skip((skip - 1) * pageSize);
        const totalCount = await projectModel.countDocuments({ activeStatus: req.query.activeStatus, projectStatus });
        // const projects = await projectModel
        //   .find({ activeStatus: req.query.activeStatus, projectStatus })
        //   .populate("technology", "techName")
        //   .sort({ createdAt: -1 })
        //   .limit(pageSize)
        //   .skip((skip - 1) * pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({ status: "200", message: "Projects fetched successfully", response: projects, totalCount, totalPages });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    await projectModel.findByIdAndUpdate({ _id: req.body.projectId }, req.body, { new: true });
    return res.status(200).json({ status: "200", message: "Project updated successfully" });
  } catch (error) {
    return res.status(200).json({ status: "500", message: "Something went wrong", error: error.message });
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


//upload file of project
const uploadProject_File =async(req, res)=>{
  try {
    let projectId=req.body.projectId;
    let attachment= `http://localhost:8000/upload/${req.file.originalname}`;
    console.log(req.file.mimetype,"attachmentType",);
    let attachmentType=req.file.mimetype;
    let originalName=req.file.originalname;
    let fileName=req.body.fileName;
     if( projectId && attachment && fileName){
    const data=  await projectupload({  projectId,
        attachment,fileName,attachmentType,originalName});
        await data.save();
      res.status(200).json({ status: '200', message: 'Project file uploaded Successfully' })

    }
    else{
      return res.status(200).json({ status: '500', message: 'Something went wrong' })

    }

    } catch (error) {
    return res.status(200).json({ status: '500', message: 'Something went wrong', error: error.message })

  }
}


// only project name-------------
const getallProject=async (req, res) => {
  try {
    const allProjectsName =await projectModel.find().select({projectName:1}).sort({ createdAt: -1 })
    ;
    res.status(200).json({ status: '200', message: 'Project file uploaded Successfully' ,response:allProjectsName})
  } catch (error) {
    return res.status(200).json({ status: '500', message: 'Something went wrong', error: error.message })

  }
}
//download file from 
const download=async (req, res) => {
try {

  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../upload', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    }
    else{
      console.log(filePath,"filePath  ")
    }
  });

} catch (error) {
  return res.status(200).json({ status: '500', message: 'Something went wrong', error: error.message })

  }
}

//get all uploaded project files/attachments
const allProjectFiles =async(req,res)=>{
  try {
    let skip=req.query.skip?parseInt(req.query.skip):1;
    let pageSize=10;
    let totalCount=await projectupload.find().countDocuments();
    const allProjectFiles=await projectupload.find().populate('projectId',"projectName").sort({ createdAt: -1 }).limit(pageSize).skip((skip - 1) * pageSize);
    const totalPages = Math.ceil(totalCount / pageSize);
    res.status(200).json({ status: '200', message: 'Project file get Successfully',response: allProjectFiles, totalCount, totalPages })
  } catch (error) {
    return res.status(200).json({ status: '500', message: 'Something went wrong', error: error.message })

  }
}
module.exports = { addProject, getProjects, updateProject, updateStatus ,uploadProject_File,getallProject,download,allProjectFiles};
