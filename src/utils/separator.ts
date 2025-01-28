import {adjustSizeWithinRange} from './size'
import { SPACING_VALUES, FONT_SIZE_VALUES } from '../helpers'

export const adjustComponentSize = (componentType, size) => {
  if (size && size !== "auto") {
    if (componentType === "connector") {
      return `${SPACING_VALUES[adjustSizeWithinRange(size, -1)]}px`;
    }
    if (componentType === "breadcrumb") {
      const adjustedSize = 2 * Math.round(1.231 * FONT_SIZE_VALUES[adjustSizeWithinRange(size, -1)] / 2);
      return `${adjustedSize}px`;
    }
  }
};

export const getVisibilityStatus = (componentType) => typeof componentType !== 'string' ? "hidden" : {
  breadcrumb: "indented",
  connector: "visible",
  default: "hidden"
}[componentType];

export const getSizeType = (componentType) => typeof componentType !== 'string' ? "md" : {
  breadcrumb: "sm",
  connector: 0,
  default: "md"
}[componentType];
