// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const getAllModules = async () => {
//     return await prisma.modules.findMany({ include: { permissions: true } });
// };

// const getModuleById = async (id) => {
//     return await prisma.modules.findUnique({
//         where: { id: Number(id) },
//         include: { permissions: true },
//     });
// };

// const createModule = async (data) => {
//     console.log("data", data)
//     return await prisma.modules.create({ data });
// };

// const updateModule = async (id, data) => {
//     return await prisma.modules.update({
//         where: { id: Number(id) },
//         data,
//     });
// };

// const deleteModule = async (id) => {
//     return await prisma.modules.delete({ where: { id: Number(id) } });
// };


// const createOrUpdateModuleWithPermissions = async (moduleData, permissionData) => {
//     // Step 1: Create module
//     const createdModule = await prisma.modules.create({
//         data: moduleData
//     });

//     // Prepare permission with newly created module ID
//     const fullPermissionData = {
//         ...permissionData,
//         module_id: createdModule.id
//     };

//     // Step 2: Check if permission already exists
//     const existingPermission = await prisma.permissions.findFirst({
//         where: {
//             admin_id: fullPermissionData.admin_id,
//             user_id: fullPermissionData.user_id,
//             role_id: fullPermissionData.role_id,
//             module_id: fullPermissionData.module_id,
//         },
//     });

//     if (existingPermission) {
//         // Step 3a: Update permission
//         await prisma.permissions.update({
//             where: { id: existingPermission.id },
//             data: fullPermissionData
//         });
//     } else {
//         // Step 3b: Create new permission
//         await prisma.permissions.create({
//             data: fullPermissionData
//         });
//     }

//     return createdModule;
// };


// module.exports = {
//     getAllModules,
//     getModuleById,
//     createModule,
//     updateModule,
//     deleteModule,
//     createOrUpdateModuleWithPermissions,
// };



const { prisma } = require('../lib/prisma.js');

// const getAllModules = async () => {
//     const modules = await prisma.modules.findMany({
//         where: { status: true },
//         include: {
//             permissions: true,
//         },
//         orderBy: {
//             id: 'asc'
//         }
//     });

//     // Optional: Convert to nested structure based on parent_id
//     const moduleMap = {};
//     modules.forEach(mod => moduleMap[mod.id] = { ...mod, children: [] });

//     const rootModules = [];

//     modules.forEach(mod => {
//         if (mod.parent_id) {
//             moduleMap[mod.parent_id]?.children.push(moduleMap[mod.id]);
//         } else {
//             rootModules.push(moduleMap[mod.id]);
//         }
//     });

//     return rootModules;
// };

const getAllModules = async () => {
    const modules = await prisma.modules.findMany({
        where: { status: true },
        include: {
            permissions: true,
        },
        orderBy: {
            id: 'asc'
        }
    });

    // Create a map of modules by ID
    const moduleMap = {};
    modules.forEach(mod => {
        moduleMap[mod.id] = { ...mod, children: [] };
    });

    const rootModules = [];

    modules.forEach(mod => {
        if (mod.parent_id) {
            if (moduleMap[mod.parent_id]) {
                moduleMap[mod.parent_id].children.push(moduleMap[mod.id]);
            } else {
                // In case parent is missing (optional fallback)
                rootModules.push(moduleMap[mod.id]);
            }
        } else {
            rootModules.push(moduleMap[mod.id]);
        }
    });

    return rootModules;
};

const getModuleById = async (id) => {
    return await prisma.modules.findUnique({
        where: { id: Number(id) },
        include: { permissions: true },
    });
};

const createModule = async (data) => {
    return await prisma.modules.create({
        data: {
            title: data.title,
            path: data.path,
            created_by: data.created_by,
            is_sidebar: data.is_sidebar ?? false,
            parent_id: data.parent_id || null,
        },
    });
};

const updateModule = async (id, data) => {
    return await prisma.modules.update({
        where: { id: Number(id) },
        data: {
            title: data.title,
            path: data.path,
            updated_by: data.updated_by,
            is_sidebar: data.is_sidebar ?? false,
            parent_id: data.parent_id || null,
        },
    });
};

const deleteModule = async (id) => {
    return await prisma.modules.delete({ where: { id: Number(id) } });
};

const createOrUpdateModuleWithPermissions = async (moduleData, permissionData) => {
    // Step 1: Create module
    const createdModule = await prisma.modules.create({
        data: {
            title: moduleData.title,
            path: moduleData.path,
            created_by: moduleData.created_by,
            is_sidebar: moduleData.is_sidebar ?? false,
            parent_id: moduleData.parent_id || null,
        }
    });

    // Prepare permission with newly created module ID
    const fullPermissionData = {
        ...permissionData,
        module_id: createdModule.id
    };

    // Step 2: Check if permission already exists
    const existingPermission = await prisma.permissions.findFirst({
        where: {
            admin_id: fullPermissionData.admin_id,
            user_id: fullPermissionData.user_id,
            role_id: fullPermissionData.role_id,
            module_id: fullPermissionData.module_id,
        },
    });

    if (existingPermission) {
        // Step 3a: Update permission
        await prisma.permissions.update({
            where: { id: existingPermission.id },
            data: fullPermissionData
        });
    } else {
        // Step 3b: Create new permission
        await prisma.permissions.create({
            data: fullPermissionData
        });
    }

    return createdModule;
};



module.exports = {
    getAllModules,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
    createOrUpdateModuleWithPermissions,
};
