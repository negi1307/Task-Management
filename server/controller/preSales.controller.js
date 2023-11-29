const preSalesModel = require("../models/preSales.model")
const projectModel = require("../models/project.model")

// create the sale
const createPreSales = async (req, res) => {
    try {
        const existingPreSale = await preSalesModel.findOne({ projectName: req.body.projectName });
        if (existingPreSale) {
            return res.status(200).json({ status: "400", message: "Pre Sale with the same projectName already exists" });
        }
        const result = await preSalesModel.create({
            clientName: req.body.clientName,
            projectName: req.body.projectName,
            description: req.body.description,
            stage: req.body.stage,
            type: req.body.type,
            status: req.body.status,
        });
        return res.status(200).json({ status: "200", message: "Pre Sale added successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};



// get the pre Sale data which is create
const getPreSaleData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let skip = parseInt(req.query.skip);
        const result = await preSalesModel.aggregate([
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "preSalesId",
                    as: "Project"
                }
            },
            // {
            //     $unwind: "$Project"
            // },
            // { $unwind: "$Project" },
            // { $unwind: "$Project.technology" },
            {
                $lookup:
                {
                    from: "technology",
                    localField: "Project.technology",
                    foreignField: "_id",
                    as: "tecres"
                },
            },
            //  { $unwind: "$tecres" },
            {
                $project: {
                    _id: 1,
                    clientName: 1,
                    description: 1,
                    projectName: 1,
                    status: 1,
                    stage: 1,
                    type: 1,
                    "Project._id": 1,
                    "Project.technology": 1,
                    "Project.startDate": 1,
                    "Project.endDate": 1,
                    "Project.projectStatus": 1,
                    "Project.projectType": 1,
                    // "tecres._id": 1,
                    // "tecres.techName": 1
                }
            }
            , {
                $skip: (skip - 1) * limit
            },
            {
                $limit: limit
            }])
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







// Update the preSale 
const updatePreSalesData = async (req, res) => {
    try {
        let createdProject;
        const { technology, startDate, endDate, projectType, projectStatus } = req.body;
        console.log(technology, "technology")
        const presale_data = await preSalesModel.findById({ _id: req.body.preSalesId });
        const project_data = await projectModel.findOne({ preSalesId: req.body.preSalesId });
        if (project_data) {
            const updatedPreSales = await preSalesModel.findByIdAndUpdate({ _id: req.body.preSalesId }, req.body, { new: true });
            await projectModel.findByIdAndUpdate({ _id: project_data._id }, req.body, { new: true });
            return res.status(200).json({ status: "200", message: "Pre Sale data updated Successfully", data: { updatedPreSales, createdProject } });

        }
        else {
            let clientName = presale_data.clientName;
            let projectName = presale_data.projectName;
            let projectDesc = presale_data.description;
            let preSalesId = presale_data._id;
            if (req.body.status === 1) {
                const newProjectData = {
                    projectName,
                    clientName,
                    technology,
                    startDate,
                    endDate,
                    projectDesc,
                    projectType,
                    projectStatus,
                    preSalesId
                };
                const createdProject = await projectModel.create(newProjectData);
                return res.status(200).json({ status: "200", message: "Project created successfully", response: createdProject });

            };

        }

        // const updatedPreSales = await preSalesModel.findByIdAndUpdate({ _id: req.body.preSalesId }, req.body, { new: true });
        // return res.status(200).json({ status: "200", message: "Pre Sale data updated Successfully", data: { updatedPreSales, createdProject } });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
};




// delete a preSale
const deletePreSaleData = async (req, res) => {
    try {
        await preSalesModel.findByIdAndDelete({ _id: req.query.preSalesId });
        return res.status(200).json({ status: "200", message: "Pre Sale deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}


module.exports = { createPreSales, getPreSaleData, updatePreSalesData, deletePreSaleData }