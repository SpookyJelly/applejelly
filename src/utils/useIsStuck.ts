//@ts-nocheck
import React from 'react'
import { useConditionalRefUpdate } from './hooks'

const hasScrollableStyle = function (element, stylePropety = 'overflow') {
    const styleValue = getComputedStyle(element)[stylePropety]
    return styleValue.includes('auto') || styleValue.includes('scroll')
}
const findScrollableAncestor = (element, options = {}) => {
    const {
        overflow = 'overflow',
        canReturnSelf = false,
        extraCheck = () => true,
    } = options

    let target = canReturnSelf ? element : element.parentElement

    while (target !== null && target !== document.body) {
        if (hasScrollableStyle(target, overflow) && extraCheck(target)) {
            return target
        }
        if (
            target.parentElement === null ||
            target.parentElement === document.body
        ) {
            return null
        }
        target = target.parentElement
    }

    return null
}

const getScrollPosition = (element) => {
    return element === document.body ? window.pageYOffset : element.scrollTop
}

export function useIsStuck(isEnabled = true) {
    const targetRef = React.useRef(null)
    const scrollableAncestorRef = React.useRef(null)
    const [isStuck, setIsStuck] = React.useState(false)

    const stickyTarget = useConditionalRefUpdate(targetRef)

    React.useEffect(() => {
        if (!isEnabled || !stickyTarget) return

        const isStickyPosition = ['sticky', '-webkit-sticky'].includes(
            getComputedStyle(stickyTarget).position
        )
        if (!isStickyPosition) return

        const updateStickyState = () => {
            const ancestor =
                scrollableAncestorRef.current ||
                (scrollableAncestorRef.current =
                    findScrollableAncestor(stickyTarget) || document.body)
            const ancestorIsDocument = ancestor === document.body
            const scrollContainer = ancestorIsDocument ? document : ancestor
            const initialScrollPosition = getScrollPosition(ancestor)
            let previousOffsetTop =
                stickyTarget.offsetTop - initialScrollPosition

            const checkStuckState = () => {
                const currentScrollPosition = getScrollPosition(ancestor)
                const currentOffsetTop =
                    stickyTarget.offsetTop - currentScrollPosition
                const scrollDistance = Math.abs(
                    currentScrollPosition - initialScrollPosition
                )
                const offsetDifference = Math.abs(
                    currentOffsetTop - previousOffsetTop
                )
                const hasScrolled = getScrollPosition(ancestor) > 0

                if (scrollDistance >= 1) {
                    setIsStuck(offsetDifference < scrollDistance && hasScrolled)
                    previousOffsetTop = currentOffsetTop
                }
            }

            scrollContainer.addEventListener('scroll', checkStuckState)
            return () =>
                scrollContainer.removeEventListener('scroll', checkStuckState)
        }

        return updateStickyState()
    }, [stickyTarget, isEnabled])

    return [isStuck, targetRef]
}
