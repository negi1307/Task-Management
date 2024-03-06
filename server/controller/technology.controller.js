const techCategoryModel = require('../models/techCategory.model');
const technologyModel = require('../models/technology.model');

// Add  a Technology category
const addTechCategory = async (req, res) => {
    try {
        const existingCategory = await techCategoryModel.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({ status: '400', message: 'Category with this name already exists' });
        }
        const result = await techCategoryModel.create({ name: req.body.name });
        return res.status(200).json({ status: '200', message: 'Tech Category Added Successfully', response: result })
    } catch (err) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' })
    }
}

// Get all Technology category
const getTechCategory = async (req, res) => {
    try {
        const result = await techCategoryModel.find({ status: req.query.status }).sort({ createdAt: -1 });
        return res.status(200).json({ status: '200', message: 'Tech Category data feteched Successfully', response: result })
    } catch (err) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' })
    }
}

// Update a Technology category
const updateTechCategory = async (req, res) => {
    try {
        await techCategoryModel.findByIdAndUpdate({ _id: req.body.id }, req.body);
        return res.status(200).json({ status: '200', message: 'Tech Category updated Successfully' })
    } catch (err) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' })
    }
}

// Add  a Technology
const addTechnology = async (req, res) => {
    try {
        const { techCategory_id, techName } = req.body
        const existingTechnology = await technologyModel.findOne({ techName: techName, techCategory_id: techCategory_id });
        if (existingTechnology) {
            return res.status(400).json({ status: '400', message: 'Technology already exists' });
        }
        const result = await technologyModel.create({ techCategory_id, techName });
        return res.status(200).json({ status: '200', message: 'Technology Added Successfully', response: result })
    } catch (err) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' })
    }
}

// Get all Technologies
const getTechnology = async (req, res) => {
    try {
        const result = await technologyModel.find({ status: req.query.status }).populate('techCategory_id').sort({ createdAt: -1 });
        return res.status(200).json({ status: '200', message: 'Technology data feteched Successfully', response: result })
    } catch (err) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' })
    }
}

// Update a Technology
const updateTechnology = async (req, res) => {
    try {
        await technologyModel.findByIdAndUpdate({ _id: req.body.id }, req.body);
        return res.status(200).json({ status: '200', message: 'Technology updated Successfully' })
    } catch (err) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' })
    }
}

// Get all technologies of a techCategory
const getTechCategoryTechnologies = async (req, res) => {
    try {
        const result = await technologyModel.find({ $and: [{ techCategory_id: req.query.id }, { status: req.query.status }] }).sort({ createdAt: -1 });
        return res.status(200).json({ status: "200", message: "Technologies fetched successfully", Response: result });
    } catch (error) {
        return res.status(500).json({ status: '500', message: 'Something went wrong' });
    }
}


module.exports = {
    addTechCategory, getTechCategory, updateTechCategory,
    addTechnology, getTechnology, updateTechnology, getTechCategoryTechnologies
}