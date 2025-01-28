import baseFormattedNumber from "./baseFormattedNumber"
import { defaultOptions } from './shared'

const units = new Map([[0, "ns"], [1, "μs"], [2, "ms"], [3, "s"]])
const MINUTE_IN_NS = 6e10
const HOUR_IN_NS = 60 * MINUTE_IN_NS
const DAY_IN_NS = 24 * HOUR_IN_NS
const MONTH_IN_NS = 30 * DAY_IN_NS
const YEAR_IN_NS = 365 * MONTH_IN_NS;

function durationNumber(originalValue, reference = originalValue, maxDecimals = 2, option = {}) {
  const mergedOptions = {...defaultOptions, ...option}
  const willDiscardTrailingZeros = mergedOptions.willDiscardTrailingZeros
  let _reference = reference;

  if (_reference < MINUTE_IN_NS) {
    return [{
      ...baseFormattedNumber(originalValue, _reference, units, maxDecimals, mergedOptions),
      hasInternalSpace: true
    }];
  }

  let value = originalValue
  const years = value / YEAR_IN_NS;

  years > 1 && (value -= years * YEAR_IN_NS);

  const months = value / MONTH_IN_NS;
  months > 1 && (value -= months * MONTH_IN_NS);

  const days = value / DAY_IN_NS;
  days > 1 && (value -= days * DAY_IN_NS);

  const hours = Math.floor(value / HOUR_IN_NS);
  value -= hours * HOUR_IN_NS;

  const minutes = Math.floor(value / MINUTE_IN_NS);
  value -= minutes * MINUTE_IN_NS;

  const seconds = Math.floor(value / 1e9);

  return _reference < HOUR_IN_NS ? seconds === 0 && willDiscardTrailingZeros ? [{
      value: `${minutes}`,
      unit: "min",
      hasInternalSpace: true
  }] : [{
      value: `${minutes}`,
      unit: "min",
      hasInternalSpace: true
  }, {
      value: `${seconds}`,
      unit: "s",
      hasInternalSpace: true
  }] : _reference < DAY_IN_NS ? minutes === 0 && willDiscardTrailingZeros ? [{
      value: `${hours}`,
      unit: "h",
      hasInternalSpace: true
  }] : [{
      value: `${hours}`,
      unit: "h",
      hasInternalSpace: true
  }, {
      value: `${minutes}`,
      unit: "min",
      hasInternalSpace: true
  }] : _reference < MONTH_IN_NS ? [{
      value: days.toFixed(1),
      unit: "d",
      hasInternalSpace: true
  }] : _reference < YEAR_IN_NS ? [{
      value: months.toFixed(1),
      unit: "mo",
      hasInternalSpace: true
  }] : [{
      value: years.toFixed(1),
      unit: "y",
      hasInternalSpace: true
  }]
}

export default durationNumber
