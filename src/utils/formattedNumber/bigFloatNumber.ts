import baseFormattedNumber from "./baseFormattedNumber";

const units = new Map([[0, ""], [1, "k"], [2, "M"], [3, "G"], [4, "T"], [5, "P"]]);

function bigFloatNumber(value, reference, maxDecimals) {
  return baseFormattedNumber(value, reference, units, maxDecimals);
}

export default bigFloatNumber;
