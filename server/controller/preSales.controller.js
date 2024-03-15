const { default: mongoose } = require("mongoose");
const preSalesModel = require("../models/preSales.model")
const projectModel = require("../models/project.model");

// create PreSales
const createPreSales = async (req, res) => {
    try {
        const { clientName, projectName, description, stage, type, status } = req.body;
        const existingProjectName = await projectModel.findOne({ projectName: new RegExp(`^${projectName.replace(/[\s]+/g, '\\s*')}\\s*$`, 'i') });
        if (existingProjectName) {
            return res.status(200).json({ status: "400", message: "ProjectName already exists" });
        } else {
            const result = await preSalesModel.create({ clientName, projectName, description, stage, type, status });
            await userHistory(req,"Create Pre Sales");
            return res.status(200).json({ status: "200", message: "Pre Sale added successfully", response: result });
        }
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

// Get PreSales Data
const getPreSaleData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let skip = parseInt(req.query.skip);

        const result = await preSalesModel.aggregate([
            {
                $lookup: {
                    from: "projects",
                    let: { preSalesId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$preSalesId", "$$preSalesId"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "technologies",
                                localField: "technology",
                                foreignField: "_id",
                                as: "technologyInfo"
                            }
                        },
                        {
                            $unwind: "$technologyInfo"
                        },
                        {
                            $group: {
                                _id: "$_id",
                                technologies: {
                                    $push: {
                                        _id: "$technologyInfo._id",
                                        techName: "$technologyInfo.techName"
                                    }
                                },
                                startDate: { $first: "$startDate" },
                                endDate: { $first: "$endDate" },
                                projectStatus: { $first: "$projectStatus" },
                                projectType: { $first: "$projectType" }
                            }
                        }
                    ],
                    as: "Project"
                }
            },
            {
                $project: {
                    _id: 1,
                    clientName: 1,
                    description: 1,
                    projectName: 1,
                    status: 1,
                    stage: 1,
                    type: 1,
                    Project: 1
                }
            },
            {
                $skip: (skip - 1) * limit
            },
            {
                $limit: limit
            }
        ]);

        const totalDocuments = await preSalesModel.countDocuments();
        return res.status(200).json({
            status: "200",
            message: "Pre Sales fetched Successfully",
            response: result,
            totalDocuments,
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit),
        });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};

// const getPreSaleData = async (req,res)=> {
//     try {
//         const data =  await projectModel.find({ preSalesId: { $exists: true } }).populate([
//            { path : 'preSalesId' , select : ['type', 'status', 'stage']},
//             {path : 'technology', select : 'techName'}
//         ])
//         return res.status(200).json({status : 200, message : "data fetched successfully", response : data})
//     } catch (error) {
//         return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
//     }
// }



// Update the preSale 
// const updatePreSalesData = async (req, res) => {
//     try {
//         let createdProject;
//         const { status, technology, startDate, endDate, projectType, projectStatus, clientName, description, projectName } = req.body;
//         const presale_data = await preSalesModel.findById({ _id: new mongoose.Types.ObjectId(req.body.preSalesId) });
//         const project_data = await projectModel.findOne({ preSalesId: req.body.preSalesId });
//         if (presale_data) {
//             const updatedPreSales = await preSalesModel.findByIdAndUpdate({ _id: req.body.preSalesId }, { $set: req.body }, { new: true });
//             project_data != null ? await projectModel.findByIdAndUpdate({ _id: project_data._id }, { $set: req.body }, { new: true }) : console.log("hey");
//             return res.status(200).json({ status: "200", message: "Pre Sale data updated Successfully", data: { updatedPreSales, createdProject } });
//         }
//         else {
//             let clientName = presale_data.clientName;
//             let projectName = presale_data.projectName;
//             let projectDesc = presale_data.description;
//             let preSalesId = presale_data._id;
//             if (parseInt(req.body.status) === 1) {
//                 const newProjectData = {
//                     projectName,
//                     clientName,
//                     technology,
//                     status,
//                     startDate,
//                     endDate,
//                     projectDesc,
//                     projectType,
//                     projectStatus,
//                     preSalesId
//                 };
//                 const createdProject = await projectModel.create(newProjectData);
//                 return res.status(200).json({ status: "200", message: "Project created successfully", response: createdProject });
//             };
//         }
//     } catch (error) {
//         return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
//     }
// };

const updatePreSalesData = async (req, res) => {
    try {
        const { preSalesId, projectName, clientName, description, stage, type, technology, startDate, endDate, projectType, projectStatus } = req.body;
        const presaleData = { projectName, clientName, description, stage, type }
        if (req.body.status) {
            presaleData.status = 1;
        }
        const preSaleUpdate = await preSalesModel.findByIdAndUpdate(preSalesId, presaleData, { new: true });
        if (preSaleUpdate.status == 1) {
            const { projectName, clientName, description } = preSaleUpdate;
            const projectData = { projectName, clientName, technology, startDate, endDate, projectDesc: description, projectStatus, projectType, preSalesId };
            const addProject = await projectModel.create(projectData);
            await userHistory(req,"Create Project");
            return res.status(200).json({ status: 200, message: "Project converted successfully", response: addProject })
        }
        await userHistory(req,"Update the Pre Sale Data");
        return res.status(200).json({ status: 200, message: "PreSales data updated successfully", response: preSaleUpdate });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}


// delete a preSale
const deletePreSaleData = async (req, res) => {
    try {
        await preSalesModel.findByIdAndDelete({ _id: req.query.preSalesId });
        await userHistory(req,"Delete Pre Sale");
        return res.status(200).json({ status: "200", message: "Pre Sale deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}


module.exports = { createPreSales, getPreSaleData, updatePreSalesData, deletePreSaleData }