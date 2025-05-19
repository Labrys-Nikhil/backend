function decodeUltraSonicSensor(hexDuration) {
    // Convert hex duration to decimal
    const duration = parseInt(hexDuration, 16);

    // Calculate distance using the formula
    const distance = (duration * 0.034) / 2;

    // Return data in specified format
    return {
        distance: { value: distance, unit: 'cm' }
    };
}

module.exports = { decodeUltraSonicSensor };
