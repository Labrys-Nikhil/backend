const { prisma } = require('../lib/prisma.js');

// const getAllRoles = async (req, res) => {
//     try {

//         const roles = await prisma.role.findMany({
//             orderBy: {
//                 id: 'asc',  // Sorting by 'id' in ascending order
//             },
           
//         });
//         return roles;
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ message: error.message });
//     }
// };

const getAllRoles = async (userRoleId) => {
    try {
       // const userRoleId = req.user; // user's role ID from auth middleware
       // return console.log("userRoleId", userRoleId)
        // let whereCondition = {};

        // if (userRoleId !== 1) {
        //     // Exclude roles with ID less than or equal to the user's own role
        //     whereCondition = {
        //         id: {
        //             gt: userRoleId
        //         }
        //     };
        // }

        // const roles = await prisma.role.findMany({
        //     where: whereCondition,
        //     orderBy: {
        //         id: 'asc',
        //     },
        // });


        let whereCondition = {};

        if (userRoleId === 1) {
            // Admin role: can see all roles
            whereCondition = {};
        } else {
            // Other roles: can only see the next higher role
            whereCondition = {
                id: userRoleId + 1
            };
        }

        const roles = await prisma.role.findMany({
            where: whereCondition,
            orderBy: {
                id: 'asc',
            },
        });


        return roles;
    } catch (error) {
        console.error(error);
        // return ({ message: error.message });
    }
};



module.exports = {
    getAllRoles
};
