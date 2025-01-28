import baseFormattedNumber from "./baseFormattedNumber"

const units = new Map([
  [-4, "p"], [-3, "n"], [-2, "μ"], [-1, "m"],
  [0, ""],
  [1, "K"], [2, "M"], [3, "B"], [4, "T"], [5, "Q"]
]);

function humanNumber(value, reference = value, maxDecimals, options) {
  const finalOptions = {
    ...options,
    hasThousandsSeparator: true
  }

  return baseFormattedNumber(value, reference, units, maxDecimals, finalOptions);
}

export default humanNumber
