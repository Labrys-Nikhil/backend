function decodePDUForIOContoller(pdu) {
    // Step 1: Extract the second-to-last byte (FC) from the PDU
    const secondLastByteHex = pdu.slice(-6, -4); // Extract "FC"
    console.log("Extracted Hex:", secondLastByteHex); // For debugging

    // Step 2: Convert the second-to-last byte to binary
    const secondLastByteBinary = parseInt(secondLastByteHex, 16).toString(2).padStart(8, '0'); // Convert to binary with 8-bit padding
    console.log("Binary Representation:", secondLastByteBinary); // For debugging

    // Step 3: Extract the 6th and 7th bits from the end
    const relay1 = secondLastByteBinary.slice(-8, -7); // 6th bit from the end
    const relay2 = secondLastByteBinary.slice(-7, -6); // 7th bit from the end

    // Step 4: Return the decoded values along with binary representation
    const response = {
        relay1: {
            value: relay1 === '1' ? 1 : 0, // Set value based on the bit
            unit: "" // Assuming no unit is required for relay1
        },
        relay2: {
            value: relay2 === '1' ? 1 : 0, // Set value based on the bit
            unit: "" // Assuming no unit is required for relay2
        }
    };

    // Step 4: Return the response object
    return response;
}

module.exports ={decodePDUForIOContoller}
