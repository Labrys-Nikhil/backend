const {generateControllerPDULT2222}  = require('../helper/controllerPDU/generateControllerPDULT2222');
const {generateControllerPDUUC300}  = require('../helper/controllerPDU/generateControllerPDUUC300');

function controllerPDUByModel(data, modelNumber) {
    console.log("data inside the controllerMapping",data);
    const { downlinkController,pdu } = data;
  switch (modelNumber) {
    case "LT-22222":
        return generateControllerPDULT2222(downlinkController,pdu);
    case "UC300":
        return generateControllerPDUUC300(downlinkController,pdu);
    default:
        throw new Error(`Unsupported model number: ${modelNumber}`);
  }
}

module.exports = {controllerPDUByModel};