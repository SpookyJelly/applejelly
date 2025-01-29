//@ts-nocheck
import React from 'react'
import { identity, equals } from 'ramda'

export interface BoxInfo {
    width: number
    height: number
    scrollHeight: number
    scrollWidth: number
    top: number
    right: number
    bottom: number
    left: number
}
type Element = HTMLElement | SVGElement | SVGGraphicsElement
type StateHandler<T = BoxInfo> = (value: T) => T
type Reducer<T = BoxInfo> = (state: T) => T

export function useDimensionsSpy<T = BoxInfo>(
    ref: React.RefObject<Element> | undefined = undefined,
    stateHandler: StateHandler<T> = identity
): [(element: Element) => void, T] {
    const elementRef = React.useRef<Element | null | any>(null)
    const resizeObserverRef = React.useRef<any>()
    const animationFrameIdRef = React.useRef<number | null>(null)

    React.useImperativeHandle(ref, () => elementRef.current)

    const getBoxInfo = (_elem: Element) => {
        const getValue = (elem: Element) => {
            if (!elem) {
                return {
                    width: 0,
                    height: 0,
                    scrollHeight: 0,
                    scrollWidth: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }
            }

            if (elem instanceof SVGGraphicsElement) {
                const boxInfo = elem.getBBox()
                return {
                    width: boxInfo.width,
                    height: boxInfo.height,
                    scrollHeight: elem.scrollHeight,
                    scrollWidth: elem.scrollWidth,
                    top: boxInfo.top,
                    right: boxInfo.right,
                    bottom: boxInfo.bottom,
                    left: boxInfo.left,
                }
            }

            const boxInfo = elem.getBoundingClientRect()
            return elem instanceof SVGElement
                ? {
                      width: elem.clientWidth,
                      height: elem.clientHeight,
                      scrollHeight: elem.scrollHeight,
                      scrollWidth: elem.scrollWidth,
                      top: boxInfo.top,
                      right: boxInfo.right,
                      bottom: boxInfo.bottom,
                      left: boxInfo.left,
                  }
                : {
                      width: elem.offsetWidth,
                      height: elem.offsetHeight,
                      scrollHeight: elem.scrollHeight,
                      scrollWidth: elem.scrollWidth,
                      top: boxInfo.top,
                      right: boxInfo.right,
                      bottom: boxInfo.bottom,
                      left: boxInfo.left,
                  }
        }

        return stateHandler(getValue(_elem))
    }

    const [boxInfo, updateBoxInfo] = React.useReducer<Reducer<T>>(
        (state) => {
            const element = elementRef.current
            if (!element) return state
            const newBoxInfo = getBoxInfo(element)
            return equals(state, newBoxInfo) ? state : newBoxInfo
        },
        null,
        getBoxInfo
    )

    React.useLayoutEffect(() => updateBoxInfo(), [])

    const requestAnimationFrameCallback = React.useCallback(() => {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current)
        }
        console.log('requestAnimationFrameCallback')
        animationFrameIdRef.current = requestAnimationFrame(() => {
            return updateBoxInfo()
        })
    }, [])

    const cleanup = React.useCallback(() => {
        resizeObserverRef.current && resizeObserverRef.current.disconnect()
        animationFrameIdRef.current &&
            cancelAnimationFrame(animationFrameIdRef.current)
    }, [])

    React.useEffect(() => cleanup, [cleanup])

    const observeElementSize = React.useCallback(
        (element: Element) => {
            if (element) {
                const currentElement = elementRef.current
                if (element !== currentElement) {
                    cleanup()
                    const resizeObserver = new ResizeObserver(
                        requestAnimationFrameCallback
                    )
                    resizeObserver.observe(element)
                    resizeObserverRef.current = resizeObserver
                    elementRef.current = element
                }
            } else {
                cleanup()
            }
        },
        [requestAnimationFrameCallback, cleanup]
    )

    return [observeElementSize, boxInfo]
}
