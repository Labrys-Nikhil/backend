function decodeRS485Full(pduStr) {
  const pdustrtospacebetween = pduStr.replace(/([0-9a-fA-F]{2})(?=[0-9a-fA-F]{2})/g, '$1 ');
  console.log("pduStr", pdustrtospacebetween);  
  const pdu = pdustrtospacebetween.trim().split(' ').map(h => parseInt(h, 16));
  console.log("string array",pdu);

  const toUInt32 = (arr, i) =>
    (arr[i] << 24) | (arr[i + 1] << 16) | (arr[i + 2] << 8) | arr[i + 3];

  const mapRelayStatus = (raw) => {
    if (raw === 65537) return { value: 1, status: "ON" };
    if (raw === 65536) return { value: 0, status: "OFF" };
    return { value: -1, status: "UNKNOWN" };
  };

  return {
    payload_version: { value: pdu[0], unit: "" },
    slave_id: { value: pdu[2], unit: "" },
    function_code: { value: pdu[1], unit: "" },
    meter_serial_number: { value: toUInt32(pdu, 3), unit: "" },
    version: { value: toUInt32(pdu, 7), unit: "" },
    cum_eb_kwh: { value: toUInt32(pdu, 11), unit: "kWh" },
    cum_dg_kwh: { value: toUInt32(pdu, 15), unit: "kWh" },
    cum_kvah_eb: { value: toUInt32(pdu, 19), unit: "kVAh" },
    cum_kvah_dg: { value: toUInt32(pdu, 23), unit: "kVAh" },
    cum_kvarh_eb: { value: toUInt32(pdu, 27), unit: "kvarh" },
    cum_kvarh_dg: { value: toUInt32(pdu, 31), unit: "kvarh" },
    relay_status: mapRelayStatus(toUInt32(pdu, 35)),
    eb_dg_status: { value: toUInt32(pdu, 39), unit: "" },
    eb_load_setting: { value: toUInt32(pdu, 43), unit: "W" },
    dg_load_setting: { value: toUInt32(pdu, 47), unit: "W" },
    eb_tariff_setting: { value: toUInt32(pdu, 51), unit: "currency/unit" },
    dg_tariff_setting: { value: toUInt32(pdu, 55), unit: "currency/unit" },
    balance_amount: { value: toUInt32(pdu, 59)/100, unit: "currency" },
    daily_charge_setting: { value: toUInt32(pdu, 63), unit: "currency/day" },
    voltage_r: { value: toUInt32(pdu, 67) / 10, unit: "V" },
    current_r: { value: toUInt32(pdu, 71) / 10, unit: "A" },
    current_y: { value: toUInt32(pdu, 75) / 10, unit: "A" },
    current_b: { value: toUInt32(pdu, 79) / 10, unit: "A" },
    power_factor: { value: toUInt32(pdu, 83) / 100, unit: "pf" },
    frequency: { value: toUInt32(pdu, 87) / 10, unit: "Hz" }
  };
}

const pdu = "01 03 03 000f3bc10000003f00000f1e0000000000001086000000000000044c000000000001000100000000000001e000000bb8000003e800000000000aa89200000000000008df00000474000000000000000000000061000001f7";
const decodedData = decodeRS485Full(pdu);
console.log(decodedData);


module.exports = { decodeRS485Full };