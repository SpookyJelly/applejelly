import { rgb, lab, LabColor, RGBColor } from 'd3-color'

const CONTRAST_RATIO_OFFSET = 0.05;

export function calculateRelativeLuminance(color) {
  const linearChannel = channel => channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  const rgbColor = typeof color === "string" ? rgb(color) : color;
  return 0.2126 * linearChannel(rgbColor.r / 255) + 0.7152 * linearChannel(rgbColor.g / 255) + 0.0722 * linearChannel(rgbColor.b / 255);
}

export function isBright(color) {
  return calculateRelativeLuminance(color) >= 0.45;
}

function applyAlphaCompositing({ color, backdropColor }) {
  if (color.opacity !== 1) {
    // if (backdropColor.opacity !== 1) {
    //   addError("Backdrop color needs an opacity of 1", { color: backdropColor });
    // }
    return {
      r: color.r * color.opacity + backdropColor.r * (1 - color.opacity),
      g: color.g * color.opacity + backdropColor.g * (1 - color.opacity),
      b: color.b * color.opacity + backdropColor.b * (1 - color.opacity),
      opacity: 1
    };
  }
  return color;
}

export function calculateContrastRatio({ foregroundColor, backgroundColor, ambientColor }) {
  let foreground = rgb(foregroundColor);
  let background = rgb(backgroundColor);

  if (foreground.opacity !== 1) {
    if (background.opacity !== 1) {
      if (ambientColor) {
        background = applyAlphaCompositing({ color: background, backdropColor: rgb(ambientColor) });
      }
      // else {
      //   addError("An ambient color should be set when background color opacity differs from 1", { backgroundColor });
      // }
    }
    foreground = applyAlphaCompositing({ color: foreground, backdropColor: background });
  }

  const foregroundLuminance = calculateRelativeLuminance(foreground);
  const backgroundLuminance = calculateRelativeLuminance(background);
  const maxLuminance = Math.max(foregroundLuminance, backgroundLuminance);
  const minLuminance = Math.min(foregroundLuminance, backgroundLuminance);

  return (maxLuminance + CONTRAST_RATIO_OFFSET) / (minLuminance + CONTRAST_RATIO_OFFSET);
}

export function selectColorBasedOnBrightness(color, brightColor, darkColor) {
  return isBright(color) ? brightColor : darkColor;
}

export function adjustColorBrightnessOrDarkness(
  action: 'darker' | 'brighter',
  amount: number,
  color: string,
  adjustExponentially?: boolean
): string {
  let adjustmentFactor = 1;

  if (adjustExponentially) {
    const labColor: LabColor = lab(color);
    adjustmentFactor = 10 * Math.exp(-labColor.l / 10) + 1;
  }

  const rgbColor: RGBColor = rgb(color);
  if (action === 'darker') {
    return rgbColor.darker(amount * adjustmentFactor).toString();
  } else {
    return rgbColor.brighter(amount * adjustmentFactor).toString();
  }
}
