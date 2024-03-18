const express = require("express");
const technology = require("../controller/technology.controller");
const { verifyAdmin } = require("../middleware/jwt.auth");
const technologyRoute = express.Router();

// Crud of techCategory
technologyRoute.post('/addTechCategory', verifyAdmin, technology.addTechCategory);
technologyRoute.get('/getTechCategory', verifyAdmin, technology.getTechCategory);
technologyRoute.put('/updateTechCategory', verifyAdmin, technology.updateTechCategory);
// Crud of Technology
technologyRoute.post('/addTechnology', verifyAdmin, technology.addTechnology);
technologyRoute.get('/getTechnology', verifyAdmin, technology.getTechnology);
technologyRoute.put('/updateTechnology', verifyAdmin, technology.updateTechnology);
technologyRoute.get('/getTechCategoryTechnologies', verifyAdmin, technology.getTechCategoryTechnologies);

module.exports = technologyRoute;