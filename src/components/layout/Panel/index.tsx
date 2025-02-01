/**
 *
 * Panel
 *
 */

import React from 'react'
import classNames from 'classnames'
import {
    getBaseProps,
    MarginProps,
    PaddingProps,
    LEVEL_SHADOWS,
} from '../../../helpers'
import { useAsComponent } from '../../../utils'
import type { Level } from '../../../types'
import './panel.scss'

const BLOCK = 'layout_panel'
function Panel(props: Props) {
    const {
        className,
        padding,
        isBorderless,
        shadowLevel,
        variant,
        isInteractive,
        isRounded,
        shouldShrinkToContent,
        as,
        children,
        innerRef,
        ...rest
    } = props

    const [Comp] = useAsComponent(as)
    const [extraClasses, restProps] = getBaseProps(
        { ...rest, padding: padding },
        ['margin', 'padding']
    )

    return (
        <Comp
            {...restProps}
            ref={innerRef}
            className={classNames(
                BLOCK,
                `${BLOCK}--${variant}`,
                `${BLOCK}--shadow-level-${shadowLevel}`,
                {
                    [`${BLOCK}--is-interactive`]: isInteractive,
                    [`${BLOCK}--is-borderless`]: isBorderless,
                    [`${BLOCK}--is-rounded`]: isRounded,
                    [`${BLOCK}--should-shrink-to-content`]:
                        shouldShrinkToContent,
                },
                extraClasses,
                className
            )}
        >
            {children}
        </Comp>
    )
}

Panel.defaultProps = {
    padding: 'md',
    isBorderless: false,
    shadowLevel: LEVEL_SHADOWS.ZERO,
    variant: 'default',
    isInteractive: false,
    isRounded: false,
    shouldShrinkToContent: false,
    as: 'div',
}

interface Props extends MarginProps, PaddingProps {
    className?: string
    isBorderless?: boolean
    shadowLevel?: number
    variant?: Level
    isInteractive?: boolean
    isRounded?: boolean
    shouldShrinkToContent?: boolean
    as?: any
    children?: React.ReactNode
    innerRef?: React.RefObject<any>
}

export default Panel
export type { Props as PanelProps }
