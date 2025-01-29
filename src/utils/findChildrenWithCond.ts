//@ts-nocheck
import React from 'react'

export const findChildrenWithCond = function checkChild(children, condition) {
    if (!children) return false

    const childrenArray = React.Children.toArray(children)
    for (let index = 0; index < childrenArray.length; index++) {
        const child = childrenArray[index]
        if (condition(child)) return true
        if (child && child.props && checkChild(child.props.children, condition))
            return true
    }

    return false
}
