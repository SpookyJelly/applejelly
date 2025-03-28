/**
 *
 * KeyCap
 *
 */

import React from 'react'
import classNames from 'classnames'
import { isMac, getContextSizeOrSize } from '../../../utils'
import './keycap.scss'

const BLOCK = 'AJ-keycap'
const sizeList = ['xs', 'sm', 'md', 'lg']
const keymap = {
    alt: isMac() ? 'opt' : 'alt',
    mod: isMac() ? '⌘' : 'ctrl',
    cmd: isMac() ? '⌘' : 'ctrl',
    '⌘': isMac() ? '⌘' : 'ctrl',
}

function KeyCap({
    className,
    keycap,
    variant,
    size = 'md',
    hasNoCapitalize = false,
}: Props) {
    const sizeValue = size || getContextSizeOrSize('md', sizeList)

    const keycapValue = (keycap || '').toLowerCase()
    const isArrowKey = ['↑', '↓', '←', '→'].includes(keycapValue)
    const isCmdKey = ['mod', 'cmd', '⌘'].includes(keycapValue) && isMac()

    const classes = classNames(
        BLOCK,
        `${BLOCK}--${sizeValue}`,
        `${BLOCK}--${variant}`,
        {
            [`${BLOCK}--is-cmd-key`]: isCmdKey,
            [`${BLOCK}--is-arrow-key`]: isArrowKey,
            [`${BLOCK}--no-capitalize`]: hasNoCapitalize,
        },
        className
    )

    return <kbd className={classes}>{keymap[keycapValue] || keycapValue}</kbd>
}

KeyCap.defaultProps = {
    variant: 'default',
    keycap: '',
}

interface Props {
    className?: string
    keycap?: string
    variant?:
        | 'default'
        | 'knockout'
        | 'disabled'
        | 'secondary'
        | 'secondary-knockout'
        | 'tertiary'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    hasNoCapitalize?: boolean
}

export default KeyCap
export type { Props as KeyCapProps }
