const space = " "

function rateNumber(rate, maxDecimals = 2) {
  const hasInternalSpace = false;
  let formattedRate;

  if (rate === 0) {
    formattedRate = "0";
  } else if (rate <= 1.0005 && rate >= 0.9995) {
    formattedRate = "100";
  } else if (rate >= 0.1) {
    formattedRate = (100 * rate).toFixed(Math.min(1, maxDecimals));
  } else if (rate >= 0.01) {
    formattedRate = (100 * rate).toFixed(Math.min(2, maxDecimals));
  } else if (maxDecimals === 0) {
    return {
      value: `<${space}1`,
      unit: "%",
      hasInternalSpace: hasInternalSpace
    };
  } else if (rate >= 0.001) {
    formattedRate = (100 * rate).toFixed(Math.min(2, maxDecimals));
  } else {
    return {
      value: `<${space}0.1`,
      unit: "%",
      hasInternalSpace: hasInternalSpace
    };
  }

  return {
    value: formattedRate,
    unit: "%",
    hasInternalSpace: hasInternalSpace
  };
};


export default rateNumber;
