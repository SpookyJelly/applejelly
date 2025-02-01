/**
 *
 * TimePill
 *
 */

import React from 'react'
import styled from '@emotion/styled'
import Icon, { IconProps } from '../../common/Icon'
import { IconTypes, Level } from '../../../types'
import cn from 'classnames'
import './timepill.scss'

type StyleType = Pick<Props, 'size' | 'level' | 'isFullWidth'>

const BLOCK = 'AJ-time-pill'
function msToTime(unit: Unit, msPeriod?: number) {
    if (msPeriod === undefined) return '-'
    switch (unit) {
        case 'w':
            return Math.floor(msPeriod / 604800000) + 'w'
        case 'd':
            return Math.floor(msPeriod / 86400000) + 'd'
        case 'h':
            return Math.floor(msPeriod / 3600000) + 'h'
        case 'm':
            return Math.floor(msPeriod / 60000) + 'm'
        case 's':
            return Math.floor(msPeriod / 1000) + 's'
        default:
        case 'ms':
            return msPeriod + 'ms'
    }
}

function TimePill({
    className,
    textLabel,
    // style,
    msPeriod,
    size,
    unit,
    level,
    iconLabel,
    iconProps,
    isFullWidth,

    ...rest
}: Props) {
    const displayValue = iconProps ? (
        <Icon hasInlineCentering isScaleDown {...iconProps} />
    ) : textLabel ? (
        textLabel
    ) : (
        msToTime(unit, msPeriod)
    )
    return (
        <div
            className={cn(BLOCK + '__wrapper', className, {
                '--full-width': isFullWidth,
                '--fit-width': !isFullWidth,
                [`--${size}`]: size,
                [`--${level}`]: level,
            })}
            {...rest}
        >
            <div className="pill" style={{ ...rest.pillStyle }}>
                {displayValue}
            </div>
        </div>
    )
}

TimePill.defaultProps = {
    size: 'md',
    unit: 'd',
    isFullWidth: false,
}

type Unit = 'w' | 'd' | 'h' | 'm' | 's' | 'ms'

interface Props
    extends Omit<React.HTMLProps<HTMLDivElement>, 'size' | 'children' | 'as'> {
    // className?: string;
    iconLabel?: IconTypes
    isFullWidth: boolean
    level?: Level
    msPeriod?: number
    size: 'sm' | 'md'
    textLabel?: string
    unit: Unit
    iconProps?: IconProps & { style?: React.CSSProperties }
    pillStyle?: React.CSSProperties
}

export default TimePill
