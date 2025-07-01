const roleService = require('../services/roleServices');

const getAllRoles = async (req, res) => {
    try {
        const userRoleId = req.user.role;
        // return console.log("userRoleId----------->", userRoleId)
        const permissions = await roleService.getAllRoles(userRoleId);
        return res.status(200).json(permissions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllRoles
}
