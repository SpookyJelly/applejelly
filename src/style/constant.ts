export const SPACING_VALUES = {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
}

export const FONT_SIZE_VALUES = {
    xxs: 8,
    xs: 11,
    sm: 12,
    md: 13,
    lg: 15,
    xl: 18,
    xxl: 23,
}

export const HEIGHT_VALUES = {
    xxs: 16,
    xs: 20,
    sm: 24,
    md: 28,
    lg: 36,
    xl: 44,
    xxl: 52,
}

export const FONT_SIZE = {
    xxs: '8px',
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '15px',
    xl: '18px',
    xxl: '23px',
} as const

export type SPACING_SIZE = keyof typeof SPACING_VALUES
export type TSHIRT_SIZE = keyof typeof FONT_SIZE_VALUES | 'inherit'
