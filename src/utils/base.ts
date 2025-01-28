import React, { DOMElement } from 'react'
import * as R from 'ramda'
import { isNumber } from '@applejelly/common'
import { FONT_SIZE } from '@applejelly/style/constant'
import type { ExpandedSize } from '@applejelly/types'
import { detect } from 'detect-browser'

const unitList = ['%', 'px', 'em', 'vh']

function isValidUnit(str: string) {
    const [_, num, unit] = str.split(/(\d+)/)
    return isNumber(Number(num)) && R.includes(unit, unitList)
}

export const getRealSize = (size: ExpandedSize) => {
    if (size === 'inherit') {
        return '100%'
    } else if (isValidUnit(size)) {
        return size
    } else if (size === 'auto') {
        return 'auto'
    }

    return FONT_SIZE[size as keyof typeof FONT_SIZE]
}

export const getLinkAttributes = (url: string) => {
    const attributes = {
        rel: 'noopener noreferrer',
        target: '_blank',
    }

    try {
        const parsedUrl = new URL(url, window.location.href)
        if (parsedUrl.hostname === window.location.hostname) {
            attributes.rel = 'noopener'
        }
    } catch (error) {}

    return attributes
}

export const isMac = () => {
    const browser = detect()
    if (browser) return browser.os === 'Mac OS'
    return false
}

export const scrollIntoView = ({ onClick, href, isEnabled }) => {
    return React.useMemo(() => {
        if (isEnabled && '#' === (href != null ? href[0] : undefined)) {
            return (event: React.MouseEvent) => {
                const element = document.getElementById(href.substring(1))
                element &&
                    element.scrollIntoView({
                        behavior: 'smooth',
                    })
                history.pushState(undefined, document.title, href)
                event.preventDefault()
                onClick && onClick(event)
            }
        }

        return onClick
    }, [href, isEnabled, onClick])
}

export const parseStringToArray = (str: string) => {
    if (typeof str !== 'string') return []

    return (str.match(/"(?:\\"|[^"])+"|[^\s]+/gi) || []).map((element) =>
        element
            .replace(/(\\\\)/g, '\\')
            .replace(/(\\")/g, '"')
            .replace(/^"(.*)"$/g, '$1')
    )
}

export const isElementOrParentMatchesClasses = (
    element: any,
    targetClasses: string[]
) => {
    if (!element || !element.classList) {
        console.error('Unexpected value for element', {
            page: window.location.pathname,
            currentElement: element,
        })
        return false
    }

    let currentElement = element

    do {
        if (
            targetClasses.some((className) =>
                currentElement.classList.contains(className)
            )
        ) {
            return true
        }
        currentElement = currentElement.parentElement
    } while (currentElement)

    return false
}

export function ensureArray<T>(element: T | T[]): T[] {
    return Array.isArray(element) ? element : [element, element]
}

export const reduceHooks = (hooks, initial, meta = {}, allowUndefined) => {
    return hooks.reduce((prev, next) => {
        const nextValue = next(prev, meta)
        if (process.env.NODE_ENV !== 'production') {
            if (!allowUndefined && typeof nextValue === 'undefined') {
                console.info(next)
                throw new Error(
                    'React Table: A reducer hook ☝️ just returned undefined! This is not allowed.'
                )
            }
        }
        return nextValue
    }, initial)
}

export const loopHooks = (hooks, context, meta = {}) => {
    return hooks.forEach((hook) => {
        const nextValue = hook(context, meta)
        if (process.env.NODE_ENV !== 'production') {
            if (typeof nextValue !== 'undefined') {
                console.info(hook, nextValue)
                throw new Error(
                    'React Table: A loop-type hook ☝️ just returned a value! This is not allowed.'
                )
            }
        }
    })
}

const uniqClasses = R.compose(R.join(' '), R.uniq, R.split(' '))

function mergeProps(...propList) {
    return propList.reduce((props, next) => {
        const { style, className, ...rest } = next

        props = {
            ...props,
            ...rest,
        }

        if (style) {
            props.style = props.style
                ? { ...(props.style || {}), ...(style || {}) }
                : style
        }

        if (className) {
            props.className = props.className
                ? props.className + ' ' + className
                : className

            props.className = uniqClasses(props.className)
        }

        if (props.className === '') {
            delete props.className
        }

        return props
    }, {})
}

function handlePropGetter(prevProps, userProps, meta) {
    // Handle a lambda, pass it the previous props
    if (typeof userProps === 'function') {
        return handlePropGetter({}, userProps(prevProps, meta))
    }

    // Handle an array, merge each item as separate props
    if (Array.isArray(userProps)) {
        return mergeProps(prevProps, ...userProps)
    }

    // Handle an object by default, merge the two objects
    return mergeProps(prevProps, userProps)
}

export const makePropGetter = (hooks, meta = {}) => {
    return (userProps = {}) => {
        return [...hooks].reduce(
            (prev, next) =>
                handlePropGetter(prev, next, {
                    ...meta,
                    userProps,
                }),
            {}
        )
    }
}

export function collectMatchingElements(
    element,
    matchCondition,
    stopAtFirstMatch = false
) {
    let matchingElements = []
    if (matchCondition(element) && !stopAtFirstMatch) {
        matchingElements.push(element)
    }

    const parentElement = element.parentElement
    if (parentElement) {
        const parentMatches = collectMatchingElements(
            parentElement,
            matchCondition,
            stopAtFirstMatch
        )
        matchingElements = [...matchingElements, ...parentMatches]
    }

    return matchingElements
}

export function getComputedStyleProperty(
    property: string,
    element: string | HTMLElement = document.body
): string {
    const targetElement: HTMLElement =
        typeof element === 'string'
            ? document.querySelector(element) || document.body
            : element
    return getComputedStyle(targetElement).getPropertyValue(property)
}
