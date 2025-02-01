/**
 *
 * FlexItem
 *
 */

import React from 'react'
import classNames from 'classnames'
import { MarginProps, PaddingProps, getBaseProps } from '../../../helpers'
import { useAsComponent } from '../../../utils'
import './flex-item.scss'

const BLOCK = 'layout_flex-item'
const FlexItem = React.forwardRef((props: FlexItemProps, ref) => {
    const {
        shrink = 0,
        grow = 0,
        basis = 'auto',
        minWidth = props.minWidth === undefined
            ? basis === 0
                ? 0
                : undefined
            : props.minWidth,
        maxWidth,
        align,
        as = 'div',
        style = {},
        className,
        children,
        ...rest
    } = props

    const [extraClass, restProps] = getBaseProps(rest, ['margin', 'padding'])
    //@ts-expect-error
    const [Comp] = useAsComponent(as)

    const styles: any = { ...style }
    const isShrink = shrink === true ? 1 : shrink
    const isGrow = grow === true ? 1 : grow

    isShrink && (styles['--flex-item-shrink'] = isShrink)
    isGrow && (styles['--flex-item-grow'] = isGrow)

    basis !== undefined &&
        basis !== 'auto' &&
        (styles['--flex-item-basis'] = basis)
    minWidth !== undefined &&
        (styles['--flex-min-width'] =
            minWidth !== 0 && typeof minWidth == 'number'
                ? `${minWidth}px`
                : minWidth)
    maxWidth &&
        (styles['--flex-max-width'] =
            typeof maxWidth == 'number' ? `${maxWidth}px` : maxWidth)
    align && (styles['--flex-item-align'] = align)
    const hasStyle = Object.keys(styles).length > 0

    return (
        <Comp
            {...restProps}
            ref={ref}
            style={hasStyle ? styles : undefined}
            className={classNames(
                BLOCK,
                {
                    [`${BLOCK}--has-min-width`]: minWidth !== undefined,
                    [`${BLOCK}--has-max-width`]: maxWidth !== undefined,
                },
                extraClass,
                className
            )}
        >
            {children}
        </Comp>
    )
})

export interface FlexItemProps extends MarginProps, PaddingProps {
    shrink?: boolean | number
    grow?: boolean | number
    basis?: string | number
    minWidth?: number
    maxWidth?: number
    align?: 'start' | 'center' | 'end'
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any> | JSX.Element
    style?: React.CSSProperties
    className?: string
    children: React.ReactNode
}

export default FlexItem
