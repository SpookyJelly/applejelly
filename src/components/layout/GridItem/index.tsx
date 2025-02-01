/**
 *
 * GridItem
 *
 */

//@ts-nocheck
import React from 'react'
import classNames from 'classnames'
import './grid-item.scss'

const rootClass = 'AJ-layout_grid-item'

function GridItem({
    colSpan,
    rowSpan,
    column,
    row,
    area,
    shouldInheritGrid,
    as: Component,
    className,
    children,
    style,
    ...restProps
}: Props) {
    const styles = {
        ...style,
        '--grid-area': area,
        '--grid-column-span':
            colSpan === 'all' ? 'var(--grid-columns-count)' : colSpan,
        '--grid-row-span': rowSpan,
        '--grid-column-start': column,
        '--grid-row-start': row,
    }

    const classes = classNames(
        rootClass,
        {
            [`${rootClass}--should-inherit-grid`]: shouldInheritGrid,
        },
        className
    )

    return (
        <Component style={styles} className={classes}>
            {children}
        </Component>
    )
}

GridItem.defaultProps = {
    as: 'div',
    style: {},
}

interface Props {
    area?: string
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    children?: React.ReactNode
    className?: string
    colSpan?: number | 'all'
    column?: string | number
    row?: string | number
    rowSpan?: number
    shouldInheritGrid?: boolean
    style?: React.CSSProperties
}

export default GridItem
export type { Props as GridItemProps }
