import baseFormattedNumber from "./baseFormattedNumber";

const units = new Map([[0, "B"], [1, "KB"], [2, "MB"], [3, "GB"], [4, "TB"], [5, "PB"]]);

function byteDecimalNumber(value, reference, maxDecimals) {
  const result = baseFormattedNumber(value, reference, units, maxDecimals);

  return {
    ...result,
    hasInternalSpace: true
  }
}

export default byteDecimalNumber
