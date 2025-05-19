const {pduToByteArrayToWaterQuality}= require('../helper/decoders/pduWaterQuality');
const {decodeLDDS75Payload} = require('../helper/decoders/LDDS75-8Decoder');
const {decodePDUForIOContoller} = require('../helper/decoders/decodePDUForIOContoller');
const {decodeUltraSonicSensor} = require('../helper/decoders/decodeUltraSonicSensor');
const {decodePDUForTemperature} = require('../helper/decoders/decodePDUForTemperature');
const {smartCurrentTansformer} = require('../helper/decoders/energyCurrentDecoder');
const { decodeEM400TLD } = require("../helper/decoders/em400TldDecoder");
const { decodeEM500SWL } = require("../helper/decoders/em500SwlDecoder");

function decodePDUByModel(pdu, modelNumber) {
  switch (modelNumber) {
    case "LHT65Decoder":
      return decodePDUForTemperature(pdu); // Call specific decoding function for Model X
    case "LT2222Decoder":
      return decodePDUForIOContoller(pdu); // Call specific decoding function for Model Y
    case "LA66Decoder":
      return decodeUltraSonicSensor(pdu);
    case "LDDS75Decoder":
      return decodeLDDS75Payload(pdu);//disntance sensor
    case "WQSLBDecoder"://water quality sensor
      return pduToByteArrayToWaterQuality(pdu);
    case "CTX101decoder":
      return smartCurrentTansformer(pdu);
    case "EM400TLDDecoder":
      return decodeEM400TLD(pdu);
    case "EM500SWLDecoder": // for EM500-SWL
      return decodeEM500SWL(pdu);
    default:
      throw new Error(`Unsupported model number: ${modelNumber}`);
  }
}

module.exports = {decodePDUByModel};
