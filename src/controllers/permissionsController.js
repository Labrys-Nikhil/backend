const permissionsService = require('../services/permissionsService');

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionsService.getAllPermissions();
        return res.status(200).json(permissions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPermissionById = async (req, res) => {
    try {
        const permission = await permissionsService.getPermissionById(req.params.id);
        return res.status(200).json(permission);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createPermission = async (req, res) => {
    try {
        const newPermission = await permissionsService.createPermission(req.body);
        return res.status(201).json(newPermission);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updatePermission = async (req, res) => {
    try {
        const updatedPermission = await permissionsService.updatePermission(req.params.id, req.body);
        return res.status(200).json(updatedPermission);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deletePermission = async (req, res) => {
    try {
        await permissionsService.deletePermission(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const bulkUpsertPermissions = async (req, res) => {
    try {
        const permissions = req.body.permissions;
        const userId = req.user.id;
        // return console.log("userId", userId)
        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'Invalid input. permissions must be a non-empty array.' });
        }

        const result = await permissionsService.upsertPermissionsBulk(permissions, parseInt(userId));

        return res.status(200).json({
            message: 'Permissions Updated successfully',
            result
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};



const getPermissionsByRole = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    console.log("user_id", user_id)
    if (!id) {
        return res.status(400).json({ message: 'id is required' });
    }

    try {
        const result = await permissionsService.getModulesWithPermissionsByRole(parseInt(id), parseInt(user_id));

        return res.status(200).json(result);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};


const getViewPermissionsByRole = async (req, res) => {
    // const { id } = req.params;
    const id = req.user.role;
    const user_id = req.user.id;
    console.log("user_id", id,user_id)
    if (!id) {
        return res.status(400).json({ message: 'id is required' });
    }

    try {
        const result = await permissionsService.getModulesWithPermissionsByRole(parseInt(id), parseInt(user_id));

        return res.status(200).json(result);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};


const getPermissionsByUserId = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'id is required' });
    }

    try {
        const result = await permissionsService.getUserModulesWithPermissions(parseInt(id));
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




module.exports = {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    bulkUpsertPermissions,
    getPermissionsByRole,
    getPermissionsByUserId,
    getViewPermissionsByRole
};
