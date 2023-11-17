const preSalesModel = require("../models/preSales.model")

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
        const result = await preSalesModel.find()
        return res.status(200).json({ status: "200", message: "Pre Sales fetched Successfully", response: result });
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}


// Update the preSale 
const updatePreSalesData = async (req, res) => {
    try {
        await preSalesModel.findByIdAndUpdate({ _id: req.body.preSalesId }, req.body, { new: true });
        return res.status(200).json({ status: "200", message: "Pre Sale updated Successfully" })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
}

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