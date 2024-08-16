/**
 *
 * ClickOutside
 *
 */

import React from 'react'
import cn from 'classnames'
import './clickoutside.scss'

const BLOCK = 'misc_clickoutside'
function ClickOutside(props: Props) {
    return <div>ClickOutside</div>
}

ClickOutside.defaultProps = {}

interface Props {
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    as?: keyof JSX.IntrinsicElements
    onClick: (event: React.MouseEvent) => void
    isDisabled?: boolean
    scope?: string
}

export default ClickOutside
export type { Props as ClickOutsideProps }
