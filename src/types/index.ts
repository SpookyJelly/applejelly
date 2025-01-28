import React from 'react'
import { FONT_SIZE } from '@applejelly/style/constant'
import icons from '@applejelly/style/icons'
import { SPACING_VALUES, FONT_SIZE_VALUES } from '../helpers'

export type Size = keyof typeof FONT_SIZE
type HeightUnit = '%' | 'px' | 'em' | 'vh'
type HeightProp = `${number}${HeightUnit}`
type Booleanish = boolean | 'true' | 'false'

export type ExpandedSize = Size | HeightProp | 'inherit' | 'auto'
export type Icons = keyof typeof icons

export interface MarginProps {
    /** Global margin, will be overridden by specific margin properties */
    margin?: ExpandedSize | 'auto'
    /** Bottom margin */
    marginBottom?: ExpandedSize | 'auto'
    /** Left margin */
    marginLeft?: ExpandedSize | 'auto'
    /** Right margin */
    marginRight?: ExpandedSize | 'auto'
    /** Top margin */
    marginTop?: ExpandedSize | 'auto'
    /** Global horizontal margin, will be overridden by specific margin properties */
    marginX?: ExpandedSize | 'auto'
    /** Global vertical margin, will be overridden by specific margin properties */
    marginY?: ExpandedSize | 'auto'
}

export interface PaddingProps {
    /** Global padding, will be overridden by specific padding properties */
    padding?: ExpandedSize | 'auto'
    /** Bottom padding */
    paddingBottom?: ExpandedSize | 'auto'
    /** Left padding */
    paddingLeft?: ExpandedSize | 'auto'
    /** Right padding */
    paddingRight?: ExpandedSize | 'auto'
    /** Top padding */
    paddingTop?: ExpandedSize | 'auto'
    /** Global horizontal padding, will be overridden by specific padding properties */
    paddingX?: ExpandedSize | 'auto'
    /** Global vertical padding, will be overridden by specific padding properties */
    paddingY?: ExpandedSize | 'auto'
}

export type Placement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'

export interface ExtraDOMProps {
    ariaAttrs?: React.AriaAttributes
    dataAttrs?: Record<`data-${string}`, string>
}

export interface ReactNativeProps {
    ref?: React.Ref<HTMLElement | undefined>
    id?: string
    key?: React.Key
    onAuxClick?: React.MouseEventHandler<HTMLDivElement>
    onClick?: React.MouseEventHandler<HTMLDivElement>
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
    onMouseMove?: React.MouseEventHandler<HTMLDivElement>
    onMouseOver?: React.MouseEventHandler<HTMLDivElement>
    role?: React.AriaRole
    style?: React.CSSProperties
    title?: string
}

export type Level = 'default' | 'success' | 'warning' | 'danger'

export interface InputNativeProps {
    inputMode?:
        | 'text'
        | 'search'
        | 'none'
        | 'tel'
        | 'url'
        | 'email'
        | 'numeric'
        | 'decimal'
    ref?: React.Ref<HTMLInputElement | null>
    autoCapitalize?: string
    autoComplete?: string
    autoCorrect?: string
    className?: string
    defaultValue?: string | number | readonly string[]
    id?: string
    key?: React.Key
    max?: string | number
    maxLength?: number
    min?: string | number
    name?: string
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onClick?: React.MouseEventHandler<HTMLInputElement>
    onFocus?: React.FocusEventHandler<HTMLInputElement>
    onInput?: React.FormEventHandler<HTMLInputElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
    onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>
    onSelect?: React.ReactEventHandler<HTMLInputElement>
    pattern?: string
    required?: boolean
    spellCheck?: Booleanish
    step?: string | number
    value?: string | number | readonly string[]
}

export type ContentRecord = { [key: string]: React.ReactNode }
export type AsPropType = any
export type IconTypes = Icons

export type SPACING_SIZE = keyof typeof SPACING_VALUES
export type TSHIRT_SIZE = keyof typeof FONT_SIZE_VALUES | 'inherit'
export type ORIGINAL_TSHIRT_SIZE = keyof typeof FONT_SIZE_VALUES
export type INITIAL_HEADER_SIZE =
    | 'sm'
    | 'md'
    | 'lg'
    | 'xs'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
export type Justify =
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
export type AlignItem =
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline'

export interface RangeData {
    min: number
    max: number
    minValue: number
    maxValue: number
    minInputValue: string
    maxInputValue: string
}
export interface FacetRangeData extends RangeData {
    step?: number
}
export interface SliderData {
    min: number
    max: number
    sliderValue: number
    inputValue: string
}
export interface FacetSliderData extends SliderData {
    step?: number
}

export type ControlledFacetValueData = any
export type FacetValuesGroup = any
export type PopoverMenuItemProps = any
export type SelectionType = 'included' | 'excluded' | undefined

export type FormatType =
    | 'human'
    | 'integer'
    | 'float'
    | 'bigFloat'
    | 'duration'
    | 'rate'

export interface ToastAction {
    label?: string
    callback?: () => void
}
