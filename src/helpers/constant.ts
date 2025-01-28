export const FORCE_CUSTOM_SCROLLBAR = "force-custom-scrollbars";
export const ORDERED_SIZES = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];
export const ORDERED_FORM_SIZES = ["xs", "sm", "md", "lg"];
export const SPACING_VALUES = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const FONT_SIZE_VALUES = {
  xxs: 8,
  xs: 11,
  sm: 12,
  md: 13,
  lg: 15,
  xl: 18,
  xxl: 23
}

export const HEIGHT_VALUES =  {
  xxs: 16,
  xs: 20,
  sm: 24,
  md: 28,
  lg: 36,
  xl: 44,
  xxl: 52
}

export const ORDERED_LEVELS = ["default", "success", "warning", "danger"];

export const LEVEL_COLORS = {
  DEFAULT: "var(--ui-status-other)",
  SUCCESS: "var(--ui-status-success)",
  WARNING: "var(--ui-status-warning)",
  DANGER: "var(--ui-status-danger)",
  default: "var(--ui-status-other)",
  success: "var(--ui-status-success)",
  warning: "var(--ui-status-warning)",
  danger: "var(--ui-status-danger)"
}

export const LEVEL_SHADOWS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
}

export const MAX_SELECT_OPEN_HEIGHT = 300;

export const LEGACY_BREAKPOINTS = {
  sm: [0, 749.9, "px"],
  md: [750, 1029.9, "px"],
  lg: [1030, 1999.9, "px"],
  xl: [2000, Infinity, "px"]
};

export const BREAKPOINTS = {
  sm: [0, 767.9, "px"],
  md: [768, 991.9, "px"],
  lg: [992, 1199.9, "px"],
  xl: [1200, 1999.9, "px"],
  xxl: [2000, Infinity, "px"]
};

export const GROUP_ELEVATION_ESCAPE_CLASS_NAME = "form_group__elevation-escape";

export const TOOLTIP_DELAYS = {
  none: 0,
  short: 300,
  long: 500
};

export const ANIMATION_DURATIONS = {
  short: 150,
  long: 250
};

export type SPACING_SIZE = keyof typeof SPACING_VALUES
export type TSHIRT_SIZE = keyof typeof FONT_SIZE_VALUES | 'inherit'
export type ORIGINAL_TSHIRT_SIZE = keyof typeof FONT_SIZE_VALUES
