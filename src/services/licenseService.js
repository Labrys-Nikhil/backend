

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createLicense = async (data) => {
  return await prisma.license.create({ data });
};

const getAllLicenses = async () => {
  return await prisma.license.findMany();
};

const getLicenseById = async (id) => {
  return await prisma.license.findUnique({ where: { id: Number(id) } });
};

const getLicenseByCustomerId = async (id) => {
  
  return await prisma.license.findMany({
    where: {
      organization: {
        customerId: id,
      },
    },
    include:{
      organization:true
    }
  });
};


const updateLicense = async (id, data) => {
  return await prisma.license.update({
    where: { id: Number(id) },
    data,
  });
};

const deleteLicense = async (id) => {
  return await prisma.license.delete({ where: { id: Number(id) } });
};

module.exports =  {
  createLicense,
  getAllLicenses,
  getLicenseById,
  updateLicense,
  deleteLicense,
  getLicenseByCustomerId
};

