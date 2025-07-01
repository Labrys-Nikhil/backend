const {
  pduToByteArrayToWaterQuality,
} = require("../helper/decoders/pduWaterQuality");
const { decodeLDDS75Payload } = require("../helper/decoders/LDDS75-8Decoder");
const {
  decodePDUForIOContoller,
} = require("../helper/decoders/decodePDUForIOContoller");
const {
  decodeUltraSonicSensor,
} = require("../helper/decoders/decodeUltraSonicSensor");
const {
  decodePDUForTemperature,
} = require("../helper/decoders/decodePDUForTemperature");
const {
  smartCurrentTansformer,
} = require("../helper/decoders/energyCurrentDecoder");
const { decodeEM400TLD } = require("../helper/decoders/em400TldDecoder");
const { decodeEM500SWL } = require("../helper/decoders/em500SwlDecoder");
const {
  milesightDeviceDecodeUC50x,
} = require("../helper/decoders/UC50xdecoder");
const {
  milesightDeviceDecodeEM300_DI,
} = require("../helper/decoders/EM300DIdecoder.js");
const { milesightDeviceDecodeUC300 } = require("./decoders/UC300-decoder");
const { ts301Milesight } = require("./decoders/ts301decoder.js");

function decodePDUByModel(pdu, modelNumber) {
  switch (modelNumber) {
    case "LHT65Decoder":
      return decodePDUForTemperature(pdu); // Call specific decoding function for Model X
    case "LT2222Decoder":
      return decodePDUForIOContoller(pdu); // Call specific decoding function for Model Y
    case "LA66Decoder":
      return decodeUltraSonicSensor(pdu);
    case "LDDS75Decoder":
      return decodeLDDS75Payload(pdu); //disntance sensor
    case "WQSLBDecoder": //water quality sensor
      return pduToByteArrayToWaterQuality(pdu);
    case "CTX101decoder":
      return smartCurrentTansformer(pdu);
    case "EM400TLDDecoder":
      return decodeEM400TLD(pdu);
    case "EM500-SWLDecoder": // for EM500-SWL
      return decodeEM500SWL(pdu);
    case "EM300-DIDecoder":
      return milesightDeviceDecodeEM300_DI(pdu);
    case "TS301-MSDecoder":
      return ts301Milesight(pdu);
    case "UC50xdecoder":
      return milesightDeviceDecodeUC50x(pdu);
    case "UC300-decoder":
      return milesightDeviceDecodeUC300(pdu);
    case "UC51xdecoder":
      return milesightDeviceDecodeUC51x;
    default:
      throw new Error(`Unsupported model number: ${modelNumber}`);
  }
}

module.exports = { decodePDUByModel };
