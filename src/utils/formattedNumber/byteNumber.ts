import baseFormattedNumber from "./baseFormattedNumber";

const units = new Map([[0, "B"], [1, "KiB"], [2, "MiB"], [3, "GiB"], [4, "TiB"], [5, "PiB"]]);

function byteNumber(value, reference, maxDecimals) {

  const result = baseFormattedNumber(value, reference, units, maxDecimals, {
    shouldFormatInBinary: true
  });

  return {
    ...result,
    hasInternalSpace: true
  }
}

export default byteNumber;
