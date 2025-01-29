//@ts-nocheck
import React from 'react'
import * as R from 'ramda'
import { SizeContext } from '../context'
import { ORDERED_SIZES, SPACING_VALUES, TSHIRT_SIZE } from '../helpers/constant'

export function getContextSizeOrSize(
    size: TSHIRT_SIZE,
    sizeList: string[] = [...ORDERED_SIZES, 'inherit']
) {
    const contextProps = React.useContext(SizeContext)
    return contextProps &&
        contextProps.size &&
        sizeList.includes(contextProps.size)
        ? contextProps.size
        : size
}

export const findMinSize = (...sizes: string[]) => {
    const indexes = sizes.map((size) => ORDERED_SIZES.indexOf(size))
    return ORDERED_SIZES[Math.min(...indexes)]
}

export const findMaxSize = (...sizes: string[]) => {
    const indexes = sizes.map((size) => ORDERED_SIZES.indexOf(size))
    return ORDERED_SIZES[Math.max(...indexes)]
}

export const compareSizes = (size1: string, size2: string, size3: string) => {
    return findMinSize(size3, findMaxSize(size1, size2))
}

export const complexSizeDetermination = (size: string, sizes: string[]) => {
    return compareSizes(findMinSize(...sizes), size, findMaxSize(...sizes))
}

export const adjustSizeWithinRange = (size: string, adjustment: number) => {
    const index = ORDERED_SIZES.indexOf(size) + adjustment
    return ORDERED_SIZES[Math.min(ORDERED_SIZES.length - 1, Math.max(0, index))]
}

export const spacingValuesKeys = Object.keys(SPACING_VALUES)

export const getSpaceValue = (value: number | string | any) => {
    const keys = R.keys(SPACING_VALUES)

    if (value !== undefined) {
        if (typeof value === 'number') {
            return `${value}px`
        } else {
            if (R.includes(value, keys)) {
                return `${SPACING_VALUES[value as keyof typeof SPACING_VALUES]}px`
            }
        }
    }

    return '0px'
}
