//@ts-nocheck
import React, { useState, useLayoutEffect, useRef } from 'react'

type Element =
    | Document
    | Window
    | HTMLElement
    | React.RefObject<HTMLElement>
    | null
    | undefined
type DefaultElement = Document | Window | HTMLElement

const useElement = (
    element: Element,
    defaultElement: DefaultElement = document
): Element => {
    const [elem, setElem] = useState<Element>(null)

    useLayoutEffect(() => {
        const newElem = (() => {
            if (element) {
                if (element instanceof Document) {
                    return document
                } else if (element instanceof Window) {
                    return window
                } else if (element instanceof HTMLElement) {
                    return element
                } else {
                    return 'current' in element
                        ? element.current
                        : defaultElement
                }
            } else {
                return defaultElement
            }
        })()

        if (newElem !== elem) {
            setElem(newElem)
        }
    })

    return elem
}

interface UseEventListenerOptions {
    capture?: boolean
    once?: boolean
    passive?: boolean
    defaultElement?: Element
}

export function useEventListener(
    eventType: string,
    listener: (event: Event) => void,
    target?: Element,
    isDisabled?: boolean,
    options: UseEventListenerOptions = {}
): void {
    const { capture, once, passive, defaultElement } = options

    const element = defaultElement === undefined ? window : defaultElement
    const ref = useRef<(event: Event) => void>(listener)

    useLayoutEffect(() => {
        ref.current = listener
    }, [listener])

    const newElem = useElement(target, element)

    useLayoutEffect(() => {
        if (newElem && newElem.addEventListener && !isDisabled) {
            const currentListener = (event: Event) => ref.current(event)
            const newOptions = { capture, once, passive }
            newElem.addEventListener(eventType, currentListener, newOptions)

            return () =>
                newElem.removeEventListener(
                    eventType,
                    currentListener,
                    newOptions
                )
        }
    }, [eventType, newElem, isDisabled, ref, capture, once, passive])
}
