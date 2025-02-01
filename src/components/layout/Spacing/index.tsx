/**
 *
 * Spacing
 *
 */

import React from 'react'
import classNames from 'classnames'
import { useAsComponent } from '../../../utils'
import { MarginProps, PaddingProps, getBaseProps } from '../../../helpers'

function Spacing(props: Props) {
    const { as: asProp = 'div', className, children, ...rest } = props

    const validElement = React.isValidElement(children)
        ? children
        : React.Fragment
    const [extraClasses, restProps] = getBaseProps(rest, ['margin', 'padding'])
    const [Comp] = useAsComponent(asProp)

    const classes = classNames(extraClasses, className)

    const validChildren =
        !asProp && React.isValidElement(children)
            ? children?.props?.children
            : children

    return asProp || children !== null ? (
        <Comp className={classes} {...restProps}>
            {validChildren}
        </Comp>
    ) : null
}

interface Props extends MarginProps, PaddingProps {
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    className?: string
    children?: React.ReactNode
    style?: React.CSSProperties
}

export default Spacing
export type { Props as SpacingProps }
