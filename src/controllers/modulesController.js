const modulesService = require('../services/modulesService');

const getAllModules = async (req, res) => {
    try {
        const modules = await modulesService.getAllModules();
        return res.status(200).json(modules);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getModuleById = async (req, res) => {
    try {
        const module = await modulesService.getModuleById(req.params.id);
        return res.status(200).json(module);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createModule = async (req, res) => {
    try {
        const newModule = await modulesService.createModule(req.body);
        return res.status(201).json(newModule);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};

const updateModule = async (req, res) => {
    try {
        const updatedModule = await modulesService.updateModule(req.params.id, req.body);
        return res.status(200).json(updatedModule);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteModule = async (req, res) => {
    try {
        await modulesService.deleteModule(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const createModuleWithPermission = async (req, res) => {
    try {
        const { module, permission } = req.body;

        const newModule = await modulesService.createOrUpdateModuleWithPermissions(module, permission);

        return res.status(201).json({
            message: 'Module created and permission handled',
            module: newModule
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const bulkUpsertPermissions = async (req, res) => {
    try {
        const permissions = req.body.permissions;

        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'Invalid input. permissions must be a non-empty array.' });
        }

        const result = await permissionsService.upsertPermissionsBulk(permissions);

        return res.status(200).json({
            message: 'Bulk permissions processed successfully',
            result
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllModules,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
    createModuleWithPermission,
    bulkUpsertPermissions,
};