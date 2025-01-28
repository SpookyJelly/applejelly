import baseFormattedNumber from "./baseFormattedNumber";
import { defaultOptions } from "./shared";

const units = new Map(
  [[-4, "p"], [-3, "n"], [-2, "μ"], [-1, "m"],
  [0, ""],
  [1, "k"], [2, "M"], [3, "G"], [4, "T"], [5, "P"]
]);

function basicNumber(value, reference, maxDecimals, options) {
  const finalOptions = {...defaultOptions, ...options};

  return baseFormattedNumber(value, reference, units, maxDecimals, finalOptions);
}


export default basicNumber;
