//@ts-nocheck
import React from 'react'
import { LAST_VISIBLE_ITEM, DATA_LAST_VISIBLE_ITEM } from './index'
import { useVisibilityObserver } from '../../../utils'

function useDynamicChildrenVisibility(props: Props) {
    const {
        isEnabled,
        maxCount,
        hasVisibleSpy,
        visibilityOffset,
        getHandleWidth,
        shouldAlwaysRenderHandle,
        children,
        initialShownCount,
    } = props

    const containerRef = React.useRef(null)
    const handleRef = React.useRef(null)
    const beforeRef = React.useRef(null)
    const afterRef = React.useRef(null)
    const hiddenCountBoundary = maxCount
        ? Math.max(children.length - maxCount, 0)
        : 0
    const [hiddenCount, setHiddenCount] = React.useState(
        0 === maxCount
            ? children.length
            : initialShownCount
              ? children.length - initialShownCount - hiddenCountBoundary
              : 0
    )

    const lastVisibleChildRef = React.useRef(null)

    const previousVisibility =
        useVisibilityObserver(containerRef, {
            visibilityOffset: visibilityOffset,
            isEnabled: isEnabled && hasVisibleSpy,
        }) || !hasVisibleSpy

    const previousVisibilityRef = React.useRef(previousVisibility)
    previousVisibilityRef.current = previousVisibility

    React.useLayoutEffect(
        function () {
            const container = containerRef.current
            const handle = handleRef.current
            const before = beforeRef.current
            const after = afterRef.current
            if (container && isEnabled && handle) {
                if (previousVisibility) {
                    const visibleEntries = new Map()
                    const contentItems = Array.from(container.children).filter(
                        function (child) {
                            return (
                                child !== handle &&
                                child !== before &&
                                child !== after
                            )
                        }
                    )
                    const observer = new IntersectionObserver(
                        function (entries) {
                            const isVisibleSizeEmpty = visibleEntries.size === 0
                            entries.forEach(function ({
                                target,
                                intersectionRatio,
                            }) {
                                visibleEntries.set(
                                    target,
                                    intersectionRatio >= 1
                                )
                            })
                            const visibleCount = Array.from(
                                visibleEntries.values()
                            ).filter(function (e) {
                                return e
                            }).length
                            const newHiddenCount =
                                contentItems.length - visibleCount
                            const handlePosition =
                                beforeRef.current === container.children[0]
                                    ? 1
                                    : 0
                            const shouldMoveHandle =
                                container.children[
                                    visibleCount + handlePosition
                                ] !== handle
                            if (
                                newHiddenCount !== 0 &&
                                (shouldMoveHandle || isVisibleSizeEmpty)
                            ) {
                                const lastVisibleItem =
                                    lastVisibleChildRef.current ||
                                    container.querySelector(
                                        `[${DATA_LAST_VISIBLE_ITEM}]`
                                    )
                                lastVisibleItem &&
                                    delete lastVisibleItem.dataset[
                                        LAST_VISIBLE_ITEM
                                    ]

                                const lastVisibleChild =
                                    contentItems[visibleCount - 1]
                                if (lastVisibleChild) {
                                    if (
                                        lastVisibleChild.dataset[
                                            LAST_VISIBLE_ITEM
                                        ]
                                    ) {
                                        lastVisibleChild.dataset[
                                            LAST_VISIBLE_ITEM
                                        ] = ''
                                    }
                                    lastVisibleChildRef.current =
                                        lastVisibleChild
                                    const nextSibling =
                                        lastVisibleChild.nextSibling === after
                                            ? null
                                            : lastVisibleChild.nextSibling
                                    nextSibling &&
                                    newHiddenCount &&
                                    shouldMoveHandle
                                        ? container.insertBefore(
                                              handle,
                                              nextSibling
                                          )
                                        : nextSibling ||
                                          (after
                                              ? container.insertBefore(
                                                    handle,
                                                    after
                                                )
                                              : container.appendChild(handle))
                                }
                            }
                            setHiddenCount(newHiddenCount)
                        },
                        {
                            root: container,
                            threshold: 1,
                            rootMargin: '1px',
                        }
                    )

                    contentItems.forEach(function (item) {
                        return observer.observe(item)
                    })

                    return function () {
                        observer.disconnect()
                        visibleEntries.clear()
                        previousVisibilityRef.current &&
                            (after
                                ? container.insertBefore(handle, after)
                                : container.appendChild(handle),
                            setHiddenCount(
                                maxCount === 0 ? children.length : 0
                            ))
                    }
                }
            } else {
                setHiddenCount(0)
            }
        },
        [
            previousVisibility,
            isEnabled,
            children,
            hiddenCountBoundary,
            maxCount,
            shouldAlwaysRenderHandle,
        ]
    )

    const totalHiddenCount = hiddenCount + hiddenCountBoundary
    const isAllHidden = totalHiddenCount === children.length
    const charCount = totalHiddenCount ? totalHiddenCount.toString().length : 0

    React.useLayoutEffect(
        function () {
            const container = containerRef.current
            const handle = handleRef.current
            if (container && handle && isEnabled) {
                const firstChild = handle.children[0]
                if (
                    (firstChild || getHandleWidth) &&
                    ((charCount && previousVisibility && !isAllHidden) ||
                        shouldAlwaysRenderHandle)
                ) {
                    const width = getHandleWidth
                        ? getHandleWidth(charCount)
                        : `${firstChild.offsetWidth}px`
                    container.style.setProperty('--handle-width', width)
                }
            }
        },
        [
            charCount,
            isEnabled,
            previousVisibility,
            isAllHidden,
            getHandleWidth,
            shouldAlwaysRenderHandle,
        ]
    )

    return {
        hiddenCount: totalHiddenCount,
        ref: containerRef,
        handleRef: handleRef,
        beforeRef: beforeRef,
        afterRef: afterRef,
    }
}

useDynamicChildrenVisibility.defaultProps = {
    isEnabled: true,
    children: [],
}

interface Props {
    isEnabled?: boolean
    maxCount?: number
    hasVisibleSpy?: boolean
    visibilityOffset?: number
    getHandleWidth?: (value?: any) => any
    shouldAlwaysRenderHandle?: boolean
    children?: React.ReactNode[]
    initialShownCount?: number
    contentRef?: React.RefObject<any> | null
}

export default useDynamicChildrenVisibility
