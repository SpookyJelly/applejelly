/**
 *
 * Grid
 *
 */

import React from 'react'
import classNames from 'classnames'
import './grid.scss'
import { getSpaceValue } from '../../../utils'
import { getBaseProps, MarginProps, PaddingProps } from '../../../helpers'

const BLOCK = 'layout_grid'
const isGridDimensionValid = (dimension) =>
    typeof dimension === 'number' ||
    dimension === 'auto-fit' ||
    dimension === 'auto-fill'

const Grid = (props: GridProps) => {
    const {
        columns,
        minWidth,
        width,
        gap,
        gapX,
        gapY,
        autoRows = false,
        justifyItems,
        justifyContent,
        alignContent,
        alignItems,
        areas = [],
        isDense,
        isInline,
        isFullWidth,
        isFullHeight,
        as: Component = 'div',
        className,
        innerRef,
        children,
        ...rest
    } = props

    const processedAreas = typeof areas === 'string' ? [areas] : areas
    const templateAreas = processedAreas.length
        ? processedAreas.map((area) => `'${area}'`).join(' ')
        : undefined
    const gridTemplateColumns = isGridDimensionValid(columns)
        ? undefined
        : columns
    const gridColumnCount = isGridDimensionValid(columns)
        ? columns
        : processedAreas[0]
          ? processedAreas[0].trim().split(/\s+/).length
          : undefined
    const minWidthValue =
        typeof minWidth === 'number' ? `${minWidth}px` : minWidth
    const widthValue = typeof width === 'number' ? `${width}px` : width
    const horizontalGap = getSpaceValue(gapX !== undefined ? gapX : gap)
    const verticalGap = getSpaceValue(gapY !== undefined ? gapY : gap)

    const style = {
        '--grid-template-areas': templateAreas,
        '--grid-template-columns': gridTemplateColumns,
        '--grid-columns-count': gridColumnCount,
        '--grid-min-width': minWidthValue,
        '--grid-width': widthValue,
        '--grid-gap':
            horizontalGap !== verticalGap
                ? `${verticalGap} ${horizontalGap}`
                : horizontalGap,
        '--grid-auto-rows': autoRows
            ? autoRows === true
                ? '1fr'
                : typeof autoRows === 'number'
                  ? `${autoRows}px`
                  : autoRows
            : undefined,
        '--grid-justify-items': justifyItems,
        '--grid-justify-content': justifyContent,
        '--grid-align-content': alignContent,
        '--grid-align-items': alignItems,
    }

    const [extraClasses, restProps] = getBaseProps(rest, ['margin', 'padding'])

    return (
        <Component
            {...restProps}
            ref={innerRef}
            style={{ ...style }}
            className={classNames(
                BLOCK,
                {
                    [`${BLOCK}--is-dense`]: isDense,
                    [`${BLOCK}--is-inline`]: isInline,
                    [`${BLOCK}--is-full-width`]: isFullWidth,
                },
                extraClasses,
                className
            )}
        >
            {children}
        </Component>
    )
}

Grid.defaultProps = {
    gap: 'md',
    as: 'div',
    areas: [],
    isDense: false,
    isInline: false,
    isFullWidth: false,
    isFullHeight: false,
    style: {},
}

export interface GridProps extends MarginProps, PaddingProps {
    columns?: number | 'auto-fit' | 'auto-fill'
    minWidth?: number | string
    width?: number | string
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    gapX?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    gapY?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    autoRows?: boolean | number | string
    justifyItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
    justifyContent?:
        | 'start'
        | 'end'
        | 'center'
        | 'stretch'
        | 'space-around'
        | 'space-between'
        | 'space-evenly'
    alignContent?:
        | 'start'
        | 'end'
        | 'center'
        | 'stretch'
        | 'space-around'
        | 'space-between'
        | 'space-evenly'
    alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
    areas?: string | string[]
    isDense?: boolean
    isInline?: boolean
    isFullWidth?: boolean
    isFullHeight?: boolean
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    className?: string
    innerRef?: React.Ref<any>
    style?: React.CSSProperties
    children?: React.ReactNode
}

export default Grid
