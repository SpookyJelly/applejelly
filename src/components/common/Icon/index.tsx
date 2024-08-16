/**
 *
 * Icon
 *
 */

import React from 'react'
import cn from 'classnames'
import icons from '@applejelly/style/icons'
import './icon.scss'
import { TSHIRT_SIZE } from '@applejelly/style/constant'

const BLOCK = 'common_icon'
function Icon({
    name,
    className,
    size,
    hasInlineCentering,
    isScaleDown,
    title,
    ...rest
}: Props) {
    const classes = cn(BLOCK, `${BLOCK}--${size}`, className, {
        [`${BLOCK}--has-inline-centering`]: hasInlineCentering,
        [`${BLOCK}--is-scaled-down`]: isScaleDown,
    })

    const viewBox = rest.viewBox || '0 0 192 192'

    return (
        <svg viewBox={viewBox} className={classes} {...rest}>
            {title && <title>{title}</title>}
            <path d={icons[name]} fill={rest.fill} color={rest.color} />
        </svg>
    )
}

interface Props extends React.HTMLAttributes<SVGElement> {
    name: keyof typeof icons
    size: TSHIRT_SIZE
    hasInlineCentering?: boolean
    isScaleDown?: boolean
    fill?: string
    color?: string
    viewBox?: string
}

export default Icon
