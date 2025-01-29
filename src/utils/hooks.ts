//@ts-nocheck
import React, {
    useRef,
    useCallback,
    useState,
    useEffect,
    useLayoutEffect,
    useMemo,
    RefObject,
} from 'react'
import classNames from 'classnames'
import { useEventListener } from './useEventListener'
import isEqual from 'react-fast-compare'
import * as R from 'ramda'

type PropAny = { [key: string]: any }

export function useAsComponent(
    component: keyof JSX.IntrinsicElements | React.ComponentType<any>
) {
    const isElementValid = React.isValidElement(component)
    const isNull = component === null
    const props = isElementValid ? component.props : {}
    const propsRef = useRef<React.PropsWithChildren<any>>(props)

    propsRef.current = props

    const compType = isElementValid ? component.type : null

    const callback = useCallback(
        (_props: React.PropsWithChildren<any>) => {
            if (isNull) {
                return null
            }
            const style =
                _props.style || propsRef.current.style
                    ? {
                          ...propsRef.current.style,
                          ..._props.style,
                      }
                    : undefined

            return React.cloneElement(component, {
                ...propsRef.current,
                ..._props,
                className: classNames(
                    propsRef.current.className,
                    _props.className
                ),
                style,
            })
        },
        [compType, isNull]
    )

    return [
        isElementValid || isNull ? callback : component,
        propsRef.current as React.PropsWithChildren<any>,
    ]
}

export function useCount() {
    const [count, updateCount] = useState(0)
    const inc: any = useCallback(() => {
        updateCount(count + 1)
    }, [count])

    return [count, inc]
}

export function asComponent(props: React.PropsWithChildren<any>) {
    const as = props.as
    const children = props.children
    const otherProps = R.omit(['as', 'children'], props)
    const [comp, currentProps] = useAsComponent(as)

    return React.createElement(comp, {
        ...currentProps,
        ...otherProps,
        children: children,
    })
}

export function useCurrentRef(element: any) {
    const ref = React.useRef(element)
    React.useEffect(() => {
        ref.current = element
    }, [element])

    return ref
}

export function useLatestRef(element: any) {
    return useCurrentRef(element)
}

export function useConditionalRefUpdate(
    ref: React.RefObject<any>,
    shouldUpdate: boolean = true
) {
    const [current, setCurrent] = React.useState(() => ref.current)
    React.useEffect(() => {
        shouldUpdate && setCurrent(ref.current)
    })
    return current
}

export function useMount(
    value?: boolean
): React.RefObject<boolean | undefined> {
    const isMount = React.useRef(value)
    React.useEffect(() => {
        isMount.current = true
        return () => {
            isMount.current = false
        }
    }, [])
    return isMount
}

export function useSafeState(initialState?: any) {
    const isMount = useMount(true)
    const [state, setState] = React.useState<any>(initialState)

    const setSaftState = React.useCallback(
        (newState: any) => {
            if (isMount.current) {
                setState(newState)
            }
        },
        [isMount]
    )

    return [state, setSaftState]
}

export function useSafeCallback(initialValue) {
    const isMount = useMount(true)
    const [_, setValue] = React.useState(initialValue)
    return React.useCallback(
        (updatedValue) => {
            isMount.current && setValue(updatedValue)
        },
        [isMount]
    )
}

export function useMemoizedComponent(
    Component: React.Component,
    compareFunction: (prevProps: PropAny, nextProps: PropAny) => any,
    shouldMemoize: boolean = true
) {
    const memoizedCompareFunction = React.useCallback(
        (prevProps: PropAny, nextProps: PropAny) => {
            return compareFunction
                ? compareFunction(prevProps, nextProps)
                : false
        },
        [compareFunction]
    )

    return React.useMemo(() => {
        return shouldMemoize
            ? React.memo(
                  Component,
                  compareFunction ? memoizedCompareFunction : undefined
              )
            : Component
    }, [shouldMemoize, Component, compareFunction, memoizedCompareFunction])
}

type Element =
    | React.RefObject<HTMLElement | Document | Window>
    | HTMLElement
    | Document
    | Window
    | null
export function useElement(
    elementRef: Element,
    defaultElement: Omit<Element, 'null'> = document
) {
    const [element, setElement] = useState<Element>(null)

    useLayoutEffect(() => {
        const resolvedElement = elementRef
            ? elementRef instanceof Document
                ? document
                : elementRef instanceof Window
                  ? window
                  : elementRef instanceof HTMLElement
                    ? elementRef
                    : elementRef.current || defaultElement
            : defaultElement

        if (resolvedElement !== element) {
            setElement(resolvedElement as any)
        }
    }, [elementRef, defaultElement])

    return element
}

export function useMemoProps(currentProps: PropAny) {
    const previousPropsRef = useRef(currentProps)

    return useMemo(() => {
        const previousProps = previousPropsRef.current

        if (R.equals(currentProps, previousProps)) {
            return previousProps
        }

        previousPropsRef.current = currentProps
        return currentProps
    }, [currentProps])
}

export function useEqualValue(value, isUpdatable = true) {
    const [state, setState] = useState(value)
    const prevValueRef = useRef(value)

    useEffect(() => {
        if (isUpdatable) {
            if (prevValueRef.current !== value) {
                prevValueRef.current = value
                setState(value)
            }
        }
    }, [value, isUpdatable])

    return [state, setState]
}

export function useUpdatableState(props: any) {
    const [state, setState] = useState(props)

    useEffect(() => {
        setState(props)
    }, [props])

    return [state, setState]
}

export function useEveryUpdatableState(value: any, counter = 0) {
    const [state, setState] = useState(value)

    useEffect(() => {
        setState(value)
    }, [value, counter])

    return [state, setState]
}

export function useHashChange(isDisabled = false) {
    const [hash, setHash] = useUpdatableState(
        document.location.hash.substring(1)
    )
    useEventListener(
        'hashchange',
        () => {
            setHash(document.location.hash.substring(1))
        },
        undefined,
        !isDisabled
    )
    return hash
}

function applyRefOrExecute(refOrFunc, value) {
    if (refOrFunc) {
        if (typeof refOrFunc == 'function') {
            return refOrFunc(value)
        } else {
            refOrFunc.current = value
        }
    }
}

export function useApplyRefOrExecute(refOrFunc, ref) {
    useLayoutEffect(() => {
        applyRefOrExecute(refOrFunc, ref.current)
    })
}

export function useDeepMemo<T>(value: T): T {
    const ref = useRef<T>(value)
    return useMemo(() => {
        if (isEqual(value, ref.current)) return ref.current
        ref.current = value
        return value
    }, [value])
}

export function useGetLatest(obj) {
    const ref = useRef(obj)
    ref.current = obj
    return useCallback(() => {
        return ref.current
    }, [])
}

export function useGetLastCurrent<T>(current: T) {
    const ref = useRef<T>(current)
    useEffect(() => {
        ref.current = current
    }, [current])
    return ref.current
}

function resolveElement(
    targetElement:
        | HTMLElement
        | Document
        | Window
        | RefObject<HTMLElement>
        | null,
    defaultElement: HTMLElement | Document | Window
): HTMLElement | Document | Window {
    if (!targetElement) return defaultElement
    if (targetElement instanceof Document) return document
    if (targetElement instanceof Window) return window
    if (targetElement instanceof HTMLElement) return targetElement
    return targetElement.current || defaultElement
}

export function useResolvedElement<T extends HTMLElement>(
    targetElement: T | RefObject<T> | null,
    defaultElement: HTMLElement | Document | Window = document
): T | HTMLElement | Document | Window | null {
    const [resolvedElement, setResolvedElement] = useState<
        T | HTMLElement | Document | Window | null
    >(null)

    useLayoutEffect(() => {
        const resolved = resolveElement(targetElement, defaultElement)
        if (resolved !== resolvedElement) {
            setResolvedElement(resolved)
        }
    }, [targetElement, defaultElement, resolvedElement])

    return resolvedElement
}

export function useResizeObserver() {
    const [size, setSize] = useState({ width: 0, height: 0 })
    const ref = useRef(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new ResizeObserver((entries) => {
            if (entries.length === 0) return
            const { width, height } = entries[0].contentRect
            setSize({ width, height })
        })

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [ref.current])

    return [ref, size]
}
