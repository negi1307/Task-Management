const express = require("express");
const technology = require("../controller/technology.controller");
const { verifyAdmin, verifyUser } = require("../middleware/jwt.auth");
const technologyRoute = express.Router();

// Crud of techCategory
technologyRoute.post('/addTechCategory', verifyAdmin, technology.addTechCategory);
technologyRoute.get('/getTechCategory', verifyUser, technology.getTechCategory);
technologyRoute.put('/updateTechCategory', verifyAdmin, technology.updateTechCategory);
// Crud of Technology
technologyRoute.post('/addTechnology', verifyAdmin, technology.addTechnology);
technologyRoute.get('/getTechnology', verifyUser, technology.getTechnology);
technologyRoute.put('/updateTechnology', verifyAdmin, technology.updateTechnology);
technologyRoute.get('/getTechCategoryTechnologies', technology.getTechCategoryTechnologies);

module.exports = technologyRoute;