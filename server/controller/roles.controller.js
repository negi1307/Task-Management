const rolesModel = require('../models/role.model');

// Add A role
const addRole = async (req, res) => {
    try {
        const existRole = await rolesModel.findOne({ role: req.body.role })
        if (!existRole) {
            const result = await rolesModel.create({
                role: req.body.role
            });
            res.status(200).json({ status: "200", message: "Role added successfully", response: result });
        } else {
            res.status(200).json({ status: "400", message: "This role already exist" });
        }
    } catch (err) {
        res.status(500).json({ status: "500", message: "something went wrong" });
    }
}

// Get roles Acc to user Token
const getRoles = async (req, res) => {
    try {
    //   const currentUserRole = req.user.role;
    //   let query = {};
    //   if (currentUserRole === 'Admin') {
    //     query = { role: { $ne: currentUserRole } };
    //   } else if (currentUserRole === 'CTO') {
    //     query = { role: { $nin: ['Admin', currentUserRole] } };
    //   } else if (currentUserRole === 'PM') {
    //     query = { role: { $nin: ['Admin', 'CTO', currentUserRole] } };
    //   }
      const result = await rolesModel.find();      
      return res.status(200).json({ status: "200", message: "Roles retrieved successfully", response: result });
    } catch (error) {
      return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
    }
  };
  

// Get All roles for admin
const getAllRoles = async (req, res) => {
    try {
        // const currentUserRole = req.user.role;
        const result = await rolesModel.find(/*{role: { $ne: currentUserRole }}*/);
        return res.status(200).json({ status: "200", message: "Roles get successfully", response: result })
    } catch (error) {
        return res.status(500).json({ status: "500", message: "something went wrong", error: error.message })
    }
}

// Delete a Role
const deleteRole = async (req, res) => {
    try {
        const existUser = await rolesModel.findById({ _id: req.query.id });
        if (existUser) {
            await rolesModel.findByIdAndDelete({ _id: req.query.id });
            res.status(200).json({ status: "200", message: 'Role deleted Successfully' })
        } else {
            res.status(200).json({ status: "400", message: "Role wasn,t found" })
        }
    } catch (err) {
        return res.status(500).json({ status: "500", message: 'Something went wrong', error: err.message })
    }
}

module.exports = { addRole, getRoles, getAllRoles, deleteRole }