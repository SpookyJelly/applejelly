import React, { useMemo, useContext } from 'react'
import classNames from 'classnames'
import { SizeContext } from '../../../context'
import { getContextSizeOrSize, useAsComponent } from '../../../utils'
import {
    MarginProps,
    PaddingProps,
    getBasePropsClassnames,
    omitBaseProps,
} from '../../../helpers'
import type { SPACING_SIZE, TSHIRT_SIZE } from '../../../helpers'
import './text.scss'

const BLOCK = 'AJ-typography_text'

const Text: React.FC<TextProps> = (props: TextProps) => {
    const {
        shouldInherit,
        children,
        size,
        variant,
        weight,
        isItalic,
        isMonospace,
        hasEllipsis,
        as,
        align = shouldInherit ? undefined : 'left',
        innerRef,
        className,
        textTransform,
        overflowWrap,
        whiteSpace,
        style,
        shouldResetEditorialCopyContext,
        ...rest
    } = props

    const asPropType = props.as === undefined ? 'span' : props.as
    const [Comp] = useAsComponent(asPropType)

    const contextSize = getContextSizeOrSize('md')
    const sizeValue = size === 'inherit' ? undefined : size || contextSize
    const contextProps = useMemo(() => {
        return { size: sizeValue }
    }, [sizeValue])
    const marginPaddingClasses = getBasePropsClassnames(props, [
        'margin',
        'padding',
    ])
    const restProps = omitBaseProps(rest, ['margin', 'padding'])

    const classes = classNames(
        BLOCK,
        {
            [`${BLOCK}--${sizeValue}`]: sizeValue,
            [`${BLOCK}--${variant}`]: variant,
            [`${BLOCK}--${weight}`]: weight,
            [`${BLOCK}--${align}`]: align,
            [`${BLOCK}--is-italic`]: isItalic,
            [`${BLOCK}--is-monospace`]: isMonospace,
            [`${BLOCK}--ws-${whiteSpace}`]: whiteSpace,
            [`${BLOCK}--has-ellipsis`]: hasEllipsis,
            [`${BLOCK}--ow-${overflowWrap}`]: overflowWrap,
            [`${BLOCK}--${textTransform}`]: textTransform,
            [`${BLOCK}--not-editorial-copy`]: shouldResetEditorialCopyContext,
        },
        marginPaddingClasses,
        className
    )

    return (
        <SizeContext.Provider value={contextProps}>
            <Comp
                className={classes}
                ref={innerRef}
                style={style}
                {...restProps}
            >
                {children}
            </Comp>
        </SizeContext.Provider>
    )
}

Text.defaultProps = {
    as: 'span',
    size: 'md',
    variant: 'default',
    weight: 'normal',
    align: 'left',
    // textTransform: 'none',
    // overflowWrap: 'normal',
    // whiteSpace: 'normal',
    shouldResetEditorialCopyContext: false,
    style: {},
}

// interface Props extends TextProps, MarginProps, PaddingProps {}

export interface TextProps extends MarginProps, PaddingProps {
    shouldInherit?: boolean
    size?: TSHIRT_SIZE
    variant?:
        | 'default'
        | 'secondary'
        | 'tertiary'
        | 'knockout'
        | 'success'
        | 'warning'
        | 'danger'
        | 'disabled'
    weight?: 'normal' | 'bold' | 'thin'
    isItalic?: boolean
    isMonospace?: boolean
    hasEllipsis?: boolean
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    align?: 'left' | 'center' | 'right'
    innerRef?: React.Ref<any>
    textTransform?: 'none' | 'lowercase' | 'uppercase' | 'capitalize'
    overflowWrap?: 'normal' | 'anywhere' | 'break-word'
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
    shouldResetEditorialCopyContext?: boolean
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode
}

export const textProps = [
    'shouldInherit',
    'size',
    'variant',
    'weight',
    'isItalic',
    'isMonospace',
    'hasEllipsis',
    'as',
    'align',
    'innerRef',
    'textTransform',
    'overflowWrap',
    'whiteSpace',
    'shouldResetEditorialCopyContext',
    'style',
    'className',
    'children',
]

export default Text
