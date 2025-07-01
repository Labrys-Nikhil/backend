// controllers/deviceHardwareTypeController.js

const getDecoderName = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the deviceHardwareType by ID
        const deviceHardwareType = await prisma.deviceHardwareType.findUnique({
            where: { id: parseInt(id, 10) },
            select: {
                id: true,
                name: true,
                decoderName: true, // Only fetch necessary fields
            },
        });

        if (!deviceHardwareType) {
            return res.status(404).json({ message: 'Device Hardware Type not found' });
        }

        return res.status(200).json({
            id: deviceHardwareType.id,
            name: deviceHardwareType.name,
            decoderName: deviceHardwareType.decoderName,
        });
    } catch (error) {
        console.error('Error fetching decoder name:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching the decoder name',
            error: error.message,
        });
    }
};

module.exports = {
    getDecoderName,
};
