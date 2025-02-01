/**
 *
 * Flex
 *
 */

import React from 'react'
import classNames from 'classnames'
import { MarginProps, PaddingProps, getBaseProps } from '../../../helpers'
import type { SPACING_SIZE } from '../../../helpers'
import { getSpaceValue, useAsComponent } from '../../../utils'
import './Flex.scss'

const BLOCK = 'AJ-layout_flex'
const Flex = React.forwardRef((props: FlexProps, ref) => {
    const {
        children,
        isInline,
        hasStretchedItems,
        as: propAs = isInline ? 'span' : 'div',
        direction,
        alignItems,
        justify,
        wrap,
        gap,
        gapX = gap,
        gapY = gap,
        minWidth,
        maxWidth,
        isFullWidth,
        isFullHeight,
        style,
        className,
        ...rest
    } = props

    const [extraClasses, restProps] = getBaseProps(rest, ['margin', 'padding'])
    const styleValue = { ...style }
    const hasXGap =
        gapX && !(wrap === 'nowrap' && direction?.includes('column'))
    const hasYGap = gapY && !(wrap === 'nowrap' && direction?.includes('row'))

    if (minWidth !== undefined) {
        styleValue['--flex-min-width'] =
            minWidth !== 0 && typeof minWidth == 'number'
                ? `${minWidth}px`
                : minWidth
    }

    if (maxWidth) {
        styleValue['--flex-max-width'] =
            typeof maxWidth == 'number' ? `${maxWidth}px` : maxWidth
    }

    if (hasXGap) {
        styleValue['--flex-gap-x'] = getSpaceValue(gapX)
    }

    if (hasYGap) {
        styleValue['--flex-gap-y'] = getSpaceValue(gapY)
    }

    // const X = wrap !== 'nowrap' && (
    //   gapX && (rest.margin || rest.marginX) ||
    //   gapY && (rest.margin || rest.marginY) ||
    //   gapY && direction !== "column-reverse" && rest.marginTop ||
    //   gapY && direction === "column-reverse" && rest.marginBottom ||
    //   gapX && direction !== "row-reverse" && rest.marginLeft ||
    //   gapX && direction === "row-reverse" && rest.marginRight
    // );

    const [Comp] = useAsComponent(propAs)

    return (
        <Comp
            ref={ref}
            className={classNames(
                BLOCK,
                `${BLOCK}--direction-${direction}`,
                `${BLOCK}--align-items-${alignItems}`,
                `${BLOCK}--justify-${justify}`,
                `${BLOCK}--wrap-${wrap}`,
                {
                    [`${BLOCK}--is-full-width`]: isFullWidth,
                    [`${BLOCK}--is-full-height`]: isFullHeight,
                    [`${BLOCK}--is-inline`]: isInline,
                    [`${BLOCK}--has-stretched-items`]: hasStretchedItems,
                    [`${BLOCK}--has-x-gap`]: hasXGap,
                    [`${BLOCK}--has-y-gap`]: hasYGap,
                    [`${BLOCK}--has-min-width`]: minWidth !== undefined,
                    [`${BLOCK}--has-max-width`]: maxWidth !== undefined,
                },
                extraClasses,
                className
            )}
            style={styleValue}
            {...restProps}
        >
            {children}
        </Comp>
    )
})

Flex.defaultProps = {
    isInline: false,
    hasStretchedItems: false,
    direction: 'row',
    alignItems: 'center',
    justify: 'flex-start',
    wrap: 'nowrap',
    gap: 0,
    isFullWidth: false,
    isFullHeight: false,
}

export interface FlexProps extends MarginProps, PaddingProps {
    children?: React.ReactNode
    isInline?: boolean
    hasStretchedItems?: boolean
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
    justify?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    gap?: SPACING_SIZE | number
    gapX?: SPACING_SIZE | number
    gapY?: SPACING_SIZE | number
    minWidth?: number | string
    maxWidth?: number | string
    isFullWidth?: boolean
    isFullHeight?: boolean
    className?: string
    style?: React.CSSProperties
}

export default Flex
