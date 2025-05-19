const LicenseService = require('../services/licenseService')

// const LicenseService = {
//     async createLicense(req, res) {
//         try {
//             const license = await prisma.license.create({ data: req.body });
//             res.json(license);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },
//     async getLicense(req, res) {
//         try {
//             const license = await prisma.license.findUnique({ where: { id: req.params.id } });
//             res.json(license);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },
//     async activateLicense(req, res) {
//         try {
//             const license = await prisma.license.update({
//                 where: { id: req.params.id },
//                 data: { isActive: true },
//             });
//             res.json(license);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },
//     async deactivateLicense(req, res) {
//         try {
//             const license = await prisma.license.update({
//                 where: { id: req.params.id },
//                 data: { isActive: false },
//             });
//             res.json(license);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// };

// const PaymentService = {
//     async createPayment(req, res) {
//         try {
//             const payment = await prisma.paymentData.create({ data: req.body });
//             res.json(payment);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },
//     async getPayment(req, res) {
//         try {
//             const payment = await prisma.paymentData.findUnique({ where: { id: req.params.id } });
//             res.json(payment);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// };

// const PlanService = {
//     async createPlan(req, res) {
//         try {
//             const plan = await prisma.plan.create({ data: req.body });
//             res.json(plan);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },
//     async getPlans(req, res) {
//         try {
//             const plans = await prisma.plan.findMany();
//             res.json(plans);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// };

const getLicenseByCustomerId = async (req, res) => {
    const{id} = req.user;
    try {
        const license = await LicenseService.getLicenseByCustomerId(id);
        if (!license) {
            return res.status(404).json({ error: "License not found" });
        }
        res.json(license);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { getLicenseByCustomerId};

