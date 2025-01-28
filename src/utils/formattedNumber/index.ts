import { defaultOptions } from './shared'
import humanNumber from './humanNumber'
import byteNumber from './byteNumber'
import byteDecimalNumber from './byteDecimalNumber'
import integerNumber from './integerNumber'
import floatNumber from './floatNumber'
import bigFloatNumber from './bigFloatNumber'
import durationNumber from './durationNumber'
import rateNumber from './rateNumber'

export function formattedNumber(type, value, reference, maxDecimals, options) {
  const mergedOptions = {...defaultOptions, ...options}
  switch (type) {
    case "human":
      return [humanNumber(value, reference, maxDecimals, options)];
    case "byte":
      return [byteNumber(value, reference, maxDecimals)];
    case "byteDecimal":
      return [byteDecimalNumber(value, reference, maxDecimals)];
    case "integer":
      return [integerNumber(value, reference, mergedOptions)];
    case "float":
      return [floatNumber(value, reference, maxDecimals, mergedOptions)];
    case "bigFloat":
      return [bigFloatNumber(value, reference, maxDecimals)];
    case "duration":
      return durationNumber(value, reference, maxDecimals, mergedOptions);
    case "rate":
      return [rateNumber(value, maxDecimals)]
  }
}

export function getLimitedNumber(value = 0, max = 99) {
  const isOverMax = value > max
  const [i] = formattedNumber("integer", isOverMax ? max : value);
  return `${i.value}${i.unit}${isOverMax ? "+" : ""}`
}
