const { prisma } = require('../lib/prisma.js');

const getAllPermissions = async () => {
    return await prisma.permissions.findMany({
        include: {
            module: true,
            role: true,
        },
    });
};

const getPermissionById = async (id) => {
    return await prisma.permissions.findUnique({
        where: { id: Number(id) },
        include: {
            module: true,
            role: true,
        },
    });
};

const createPermission = async (data) => {
    return await prisma.permissions.create({ data });
};


const updatePermission = async (id, data) => {
    return await prisma.permissions.update({
        where: { id: Number(id) },
        data,
    });
};

const deletePermission = async (id) => {
    return await prisma.permissions.delete({ where: { id: Number(id) } });
};


// const upsertPermissionsBulk = async (permissionsArray) => {
//     const results = [];

//     for (const permission of permissionsArray) {
//         const { admin_id, user_id, role_id, module_id } = permission;

//         // Check for existing permission
//         const existing = await prisma.permissions.findFirst({
//             where: {
//                 admin_id,
//                 user_id,
//                 role_id,
//                 module_id
//             }
//         });

//         if (existing) {
//             const updated = await prisma.permissions.update({
//                 where: { id: existing.id },
//                 data: {
//                     ...permission,
//                     updated_at: new Date()
//                 }
//             });
//             results.push({ status: 'updated', data: updated });
//         } else {
//             const created = await prisma.permissions.create({
//                 data: {
//                     ...permission,
//                     created_at: new Date()
//                 }
//             });
//             results.push({ status: 'created', data: created });
//         }
//     }

//     return results;
// };


// const getModulesWithPermissionsByRole = async (role_id) => {
//     const modules = await prisma.modules.findMany({
//         include: {
//             permissions: {
//                 where: {
//                     role_id
//                 },
//                 select: {
//                     read: true,
//                     create: true,
//                     update: true,
//                     delete: true
//                 }
//             }
//         }
//     });

//     return modules.map(mod => ({
//         module_id: mod.id,
//         title: mod.title,
//         path: mod.path,
//         permissions: mod.permissions[0] || null
//     }));
// };


// const getModulesWithPermissionsByRole = async (role_id) => {
//     const modules = await prisma.modules.findMany({
//         include: {
//             permissions: {
//                 where: { role_id },
//                 select: {
//                     read: true,
//                     create: true,
//                     update: true,
//                     delete: true
//                 }
//             }
//         },
//         orderBy: {
//             id: 'asc'
//         }
//     });

//     // Convert to nested structure based on parent_id
//     const moduleMap = {};
//     modules.forEach(mod => {
//         moduleMap[mod.id] = {
//             module_id: mod.id,
//             title: mod.title,
//             path: mod.path,
//             is_sidebar: mod.is_sidebar,
//             parent_id: mod.parent_id,
//             permissions: mod.permissions[0] || null,
//             children: []
//         };
//     });

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

// const getModulesWithPermissionsByRole = async (role_id, user_id) => {
//     console.log(role_id, user_id)
//     const customer = await prisma.customer.findUnique({
//         where: { id: user_id },
//         select: {
//             id: true,
//             admin_id: true,
//             role_id: true
//         }
//     });

//     if (!customer) {
//         throw new Error("User not found");
//     }

//     const isAdmin = customer.admin_id === null;
//     const adminId = isAdmin ? customer.id : customer.admin_id;

//     console.log("customer",isAdmin, adminId, customer)
//     const modules = await prisma.modules.findMany({
//         include: {
//             permissions: {
//                 where: {
//                     admin_id: adminId,
//                     role_id: role_id
//                 },
//                 select: {
//                     read: true,
//                     create: true,
//                     update: true,
//                     delete: true
//                 }
//             }
//         },
//         orderBy: {
//             id: 'asc'
//         }
//     });

//     console.log("modules", modules)
//     // Convert to nested structure based on parent_id
//     const moduleMap = {};
//     modules.forEach(mod => {
//         moduleMap[mod.id] = {
//             module_id: mod.id,
//             title: mod.title,
//             path: mod.path,
//             is_sidebar: mod.is_sidebar,
//             parent_id: mod.parent_id,
//             permissions: mod.permissions[0] || null,
//             children: []
//         };
//     });

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

const upsertPermissionsBulk = async (permissionsArray, user_id) => {
    const customer = await prisma.customer.findUnique({
        where: { id: user_id },
        select: {
            id: true,
            admin_id: true,
            role_id: true
        }
    });

    if (!customer) {
        throw new Error("User not found");
    }

    // const isAdmin = customer.admin_id === null;
    const isAdmin = customer.admin_id === null || customer.role_id === 3;
    const adminId = isAdmin ? customer.id : customer.admin_id;
     console.log("check again ", isAdmin, adminId)
    const results = [];

    for (const permission of permissionsArray) {
        const { role_id, module_id, read, create, update, delete: del } = permission;

        // Check for existing permission using adminId, role_id and module_id
        const existing = await prisma.permissions.findFirst({
            where: {
                admin_id: adminId,
                role_id,
                module_id
            }
        });
 
        console.log( "existing hai", existing)
        if (existing) {
            const updated = await prisma.permissions.update({
                where: { id: existing.id },
                data: {
                    read,
                    create,
                    update,
                    delete: del,
                    updated_at: new Date()
                }
            });
            results.push({ status: 'updated', data: updated });
        } else {
            const created = await prisma.permissions.create({
                data: {
                    admin_id: adminId,
                    role_id,
                    module_id,
                    read,
                    create,
                    update,
                    delete: del,
                    user_id,              // ✅ Set the creator's user ID
                    created_by: user_id,  // ✅ Also useful to track audit
                    created_at: new Date()
                }
            });
            results.push({ status: 'created', data: created });
        }
    }


    return results;
};

// current working now 25-04
// const getModulesWithPermissionsByRole = async (role_id, user_id) => {
//     console.log(role_id, user_id);

//     // Step 1: Get customer info
//     const customer = await prisma.customer.findUnique({
//         where: { id: user_id },
//         select: {
//             id: true,
//             admin_id: true,
//             role_id: true
//         }
//     });

//     if (!customer) {
//         throw new Error("User not found");
//     }

//     const isAdmin = customer.admin_id === null;
//     const adminId = isAdmin ? customer.id : customer.admin_id;

//     console.log("customer", isAdmin, adminId, customer);

//     // Step 2: Fetch permissions including modules
//     const permissions = await prisma.modules.findMany({
//         include: {
//             permissions: {
//                 where: {
//                     role_id,
//                 },
//                 select: {
//                     read: true,
//                     create: true,
//                     update: true,
//                     delete: true
//                 }
//             }
//         }
//     });

//     console.log("permissions", permissions);

//     const moduleMap = {};
//     permissions.forEach(p => {
//         const perm = p.permissions?.[0] || {};
//         moduleMap[p.id] = {
//             module_id: p.id,
//             title: p.title,
//             path: p.path,
//             is_sidebar: p.is_sidebar,
//             parent_id: p.parent_id,
//             permissions: {
//                 read: perm.read ?? false,
//                 create: perm.create ?? false,
//                 update: perm.update ?? false,
//                 delete: perm.delete ?? false
//             },
//             children: []
//         };
//     });

//     // Step 2: nest children
//     const rootModules = [];
//     Object.values(moduleMap).forEach(mod => {
//         if (mod.parent_id && moduleMap[mod.parent_id]) {
//             moduleMap[mod.parent_id].children.push(mod);
//         } else {
//             rootModules.push(mod);
//         }
//     });
//     return rootModules;
// };




const getModulesWithPermissionsByRole = async (role_id, user_id) => {
    console.log(role_id, user_id);

    // Get customer info
    const customer = await prisma.customer.findUnique({
        where: { id: user_id },
        select: {
            id: true,
            admin_id: true,
            role_id: true
        }
    });

    // console.log("customer", customer)
    if (!customer) throw new Error("User not found");

    // const isAdmin = customer.admin_id === null;
    const isAdmin = customer.admin_id === null || customer.role_id === 3;
    const adminId = isAdmin ? customer.id : customer.admin_id;

    console.log("customer ka data", isAdmin, adminId, customer);
    // Fetch target role's permissions
    const permissions = await prisma.modules.findMany({
        include: {
            permissions: {
                where: { role_id:role_id},
                select: {
                    read: true,
                    create: true,
                    update: true,
                    delete: true
                }
            }
        }
    });

    console.log("permissions done from", permissions)

    // Only needed if role_id >= 3
    let currentUserPermissions = {};
    if (role_id >= 3) {
        const userPerms = await prisma.modules.findMany({
            include: {
                permissions: {
                    where: { role_id: role_id},
                    select: {
                        read: true,
                        create: true,
                        update: true,
                        delete: true
                    }   
                }
            }
        });
// console.log("userPerms", userPerms)
        userPerms.forEach(p => {
            const perm = p.permissions?.[0] || {};
            currentUserPermissions[p.id] = {
                read: perm.read ?? false,
                create: perm.create ?? false,
                update: perm.update ?? false,
                delete: perm.delete ?? false
            };
        });
    }

    // Build response with restrictions
    const moduleMap = {};
    permissions.forEach(p => {
        const perm = p.permissions?.[0] || {};
        const userPerm = currentUserPermissions[p.id] || {};

        moduleMap[p.id] = {
            module_id: p.id,
            title: p.title,
            path: p.path,
            is_sidebar: p.is_sidebar,
            parent_id: p.parent_id,
            permissions: {
                read: role_id <= 2 ? perm.read ?? false : (perm.read && userPerm.read) ?? false,
                create: role_id <= 2 ? perm.create ?? false : (perm.create && userPerm.create) ?? false,
                update: role_id <= 2 ? perm.update ?? false : (perm.update && userPerm.update) ?? false,
                delete: role_id <= 2 ? perm.delete ?? false : (perm.delete && userPerm.delete) ?? false
            },
            children: []
        };
    });

    // Nesting children
    const rootModules = [];
    Object.values(moduleMap).forEach(mod => {
        if (mod.parent_id && moduleMap[mod.parent_id]) {
            moduleMap[mod.parent_id].children.push(mod);
        } else {
            rootModules.push(mod);
        }
    });

    return rootModules;
};




// const getUserModulesWithPermissions = async (user_id) => {
//     // Step 1: Fetch customer info
//     const customer = await prisma.customer.findUnique({
//         where: { id: user_id },
//         select: {
//             id: true,
//             admin_id: true,
//             role_id: true
//         }
//     });

//     console.log(customer)

//     if (!customer) {
//         throw new Error("User not found");
//     }

//     // Step 2: Determine actual adminId and roleId for permission check
//     const isAdmin = customer.admin_id === null;
//     const adminId = isAdmin ? customer.id : customer.admin_id;
//     const roleId = customer.role_id;

//     // Step 3: Get permissions joined with modules
//     const permissions = await prisma.permissions.findMany({
//         where: {
//             admin_id: adminId,
//             role_id: roleId,
//             module: {
//                 status: true
//             }
//         },
//         include: {
//             module: true
//         }
//     });

//     // Step 4: Format and return result
//     return permissions.map((perm) => ({
//         module_id: perm.module.id,
//         title: perm.module.title,
//         path: perm.module.path,
//         is_sidebar: perm.module.is_sidebar,
//         permissions: {
//             read: perm.read,
//             create: perm.create,
//             update: perm.update,
//             delete: perm.delete
//         }
//     }));
// };


const getUserModulesWithPermissions = async (user_id) => {
    // 1. Get the user details: fetch admin_id and role_id
    const customer = await prisma.customer.findUnique({
        where: { id: user_id },
        select: {
            id: true,
            admin_id: true,
            role_id: true
        }
    });

    if (!customer) {
        throw new Error("User not found");
    }

    const isAdmin = customer.admin_id === null;
    const adminId = isAdmin ? customer.id : customer.admin_id;
    const roleId = customer.role_id;

    // 2. Get permissions for this admin & role, along with module info
    const permissions = await prisma.permissions.findMany({
        where: {
            admin_id: adminId,     // ✅ Filtered by admin_id
            role_id: roleId,       // ✅ Filtered by role_id
            module: {
                status: true       // only active modules
            }
        },
        include: {
            module: {
                select: {
                    id: true,
                    title: true,
                    path: true,
                    is_sidebar: true,
                    parent_id: true
                }
            }
        }
    });



    // 3. Structure modules into a map for nesting
    const moduleMap = {};
    permissions.forEach((perm) => {
        const mod = perm.module;
        moduleMap[mod.id] = {
            module_id: mod.id,
            title: mod.title,
            path: mod.path,
            is_sidebar: mod.is_sidebar,
            parent_id: mod.parent_id,
            permissions: {
                read: perm.read,
                create: perm.create,
                update: perm.update,
                delete: perm.delete
            },
            children: []
        };
    });

    // 4. Convert flat list into nested module tree
    const rootModules = [];
    Object.values(moduleMap).forEach((mod) => {
        if (mod.parent_id && moduleMap[mod.parent_id]) {
            moduleMap[mod.parent_id].children.push(mod);
        } else {
            rootModules.push(mod);
        }
    });

    return rootModules;
};



module.exports = {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    upsertPermissionsBulk,
    getModulesWithPermissionsByRole,
    getUserModulesWithPermissions
};
