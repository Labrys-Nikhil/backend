function decodeNewMeter(pduStr) {
  // Convert hex string to byte array
  const pdustrtospacebetween = pduStr.replace(/([0-9a-fA-F]{2})(?=[0-9a-fA-F]{2})/g, '$1 ');
  const pdu = pdustrtospacebetween.trim().split(' ').map(h => parseInt(h, 16));

  const toUInt32 = (arr, i) =>
    (arr[i] << 24) | (arr[i + 1] << 16) | (arr[i + 2] << 8) | arr[i + 3];

  const mapRelayStatus = (raw) => {
    if (raw === 65537) return { value: 1, status: "ON" };
    if (raw === 65536) return { value: 0, status: "OFF" };
    return { value: -1, status: "UNKNOWN" };
  };

  let idx = 0;

  return {
    meter_serial_number: { value: toUInt32(pdu, idx += 0), unit: "" },
    cum_eb_kwh: { value: toUInt32(pdu, idx += 4), unit: "kWh" },
    cum_dg_kwh: { value: toUInt32(pdu, idx += 4), unit: "kWh" },
    relay_status: mapRelayStatus(toUInt32(pdu, idx += 4)),
    eb_dg_status: { value: toUInt32(pdu, idx += 4), unit: "" },
    eb_tariff_setting: { value: toUInt32(pdu, idx += 4), unit: "currency/unit" },
    dg_tariff_setting: { value: toUInt32(pdu, idx += 4), unit: "currency/unit" },
    balance_amount: { value: toUInt32(pdu, idx += 4) / 100, unit: "currency" },
    daily_charge_setting: { value: toUInt32(pdu, idx += 4), unit: "currency/day" },
    voltage_r: { value: toUInt32(pdu, idx += 4) / 10, unit: "V" },
    current_r: { value: toUInt32(pdu, idx += 4) / 10, unit: "A" },
    pf: { value: toUInt32(pdu, idx += 4) / 100, unit: "pf" },
    frequency: { value: toUInt32(pdu, idx += 4) / 10, unit: "Hz" },
    kw_load_r: { value: toUInt32(pdu, idx += 4), unit: "kW" },
    indivisual_relay_status_eb: { value: toUInt32(pdu, idx += 4), unit: "" },
    indivisual_relay_status_dg: { value: toUInt32(pdu, idx += 4), unit: "" },
    tamper: { value: toUInt32(pdu, idx += 4), unit: "" },
    monthly_tariff: { value: toUInt32(pdu, idx += 4), unit: "" },
    happy_hour: { value: toUInt32(pdu, idx += 4), unit: "" },
    happy_day: { value: toUInt32(pdu, idx += 4), unit: "" },
    over_aattp_eb: { value: toUInt32(pdu, idx += 4), unit: "" },
    over_aattp_dg: { value: toUInt32(pdu, idx += 4), unit: "" },
    eb_load_setting: { value: toUInt32(pdu, idx += 4), unit: "W" },
    dg_load_setting: { value: toUInt32(pdu, idx += 4), unit: "W" },
    last_balance_deduction: { value: toUInt32(pdu, idx += 4) / 100, unit: "currency" },
    second_last_balance_deduction: { value: toUInt32(pdu, idx += 4) / 100, unit: "currency" },
    voltage_y: { value: toUInt32(pdu, idx += 4) / 10, unit: "V" },
    current_y: { value: toUInt32(pdu, idx += 4) / 10, unit: "A" },
    kw_load_y: { value: toUInt32(pdu, idx += 4), unit: "kW" }
  };
}

module.exports = { decodeNewMeter };
