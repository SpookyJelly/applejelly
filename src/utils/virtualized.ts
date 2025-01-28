import React from 'react'
import { elementScroll } from '@tanstack/react-virtual'

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

export const useScrollToForVirtualizer = (parentRef) => {
  const scrollingRef = React.useRef<number>()

  const scrollToFn = React.useCallback((offset, canSmooth, instance) => {
    const duration = 1000
    const start = parentRef.current.scrollTop
    const startTime = (scrollingRef.current = Date.now())

    const run = () => {
      if (scrollingRef.current !== startTime) return
      const now = Date.now()
      const elapsed = now - startTime
      const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
      const interpolated = start + (offset - start) * progress

      if (elapsed < duration) {
        elementScroll(interpolated, canSmooth, instance)
        requestAnimationFrame(run)
      } else {
        elementScroll(interpolated, canSmooth, instance)
      }
    }

    requestAnimationFrame(run)
  }, [parentRef])

  return scrollToFn
}

export const getVirtualPlaceholderHeight = (virtualizer, overscan, estimateSize) => {
  const scrollOffset = virtualizer.getScrollOffset()
  const offset = scrollOffset - (overscan * estimateSize)
  return offset > 0 ? `${offset}px`: 0
}
