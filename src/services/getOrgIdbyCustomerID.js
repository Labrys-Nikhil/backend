// services/customerService.js

const { prisma } = require('../lib/prisma.js');

const getOrganizationIdByCustomerId = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      organizations: true, // Include organizations associated with the customer
    },
  });

  // Assuming you want to return the first organization's ID
  if (customer && customer.organizations.length > 0) {
    return customer.organizations[0].id; // Return the first organization ID
  }

  throw new Error('No organization found for this customer.');
};

module.exports = {
  getOrganizationIdByCustomerId,
  // Other methods...
};
