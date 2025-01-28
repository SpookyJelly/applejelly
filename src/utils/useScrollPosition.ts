import React, { useCallback, useEffect, useRef, useState } from "react"
import { useCurrentRef, useConditionalRefUpdate } from './hooks'
import { useScroll } from './useScroll'


interface ScrollPosition {
  ref: any
  wait?: number
  isEnabled?: boolean
  direction?: "vertical" | "horizontal"
}

type checkPosition = (force?: boolean) => void

const noop = () => {}
export function useScrollPosition(props: Props) {
  const {
    ref,
    wait,
    isEnabled = true,
    direction = 'vertical'
  } = props

  const scrollStartRef = React.useRef(0)
  const scrollLengthRef = React.useRef(0)
  const clientLengthRef = React.useRef(0)

  const [isAtStart, setIsAtStart] = React.useState(true)
  const [isAtEnd, setIsAtEnd] = React.useState(false)
  const scrollElement = useConditionalRefUpdate(ref || { current: undefined })

  const checkPosition = React.useCallback((function(force = false) {
    if (force || scrollElement) {
      scrollStartRef.current = direction === 'vertical' ? scrollElement.scrollTop : scrollElement.scrollLeft
      scrollLengthRef.current = direction === 'vertical' ? scrollElement.scrollHeight : scrollElement.scrollWidth
      clientLengthRef.current = direction === 'vertical' ? scrollElement.clientHeight : scrollElement.clientWidth
    }
    const scrollStart = scrollStartRef.current
    const scrollLengt = scrollLengthRef.current
    const clientLength = clientLengthRef.current;

    setIsAtStart(scrollStart <= 0)
    setIsAtEnd(scrollLengt <= clientLength || scrollStart >= scrollLengt - clientLength)
  }), [direction, scrollElement]);

  React.useEffect((function() {
    checkPosition(false)
  }), [checkPosition]);

  const handleScrollStart = React.useCallback((event) => {
    const {
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth
    } = event.target
    scrollLengthRef.current = direction === 'vertical' ? scrollHeight : scrollWidth,
    clientLengthRef.current = direction === 'vertical' ? clientHeight : clientWidth
  }, [direction])

  const handleScroll = React.useCallback((event) => {
    const { scrollTop, scrollLeft } = event.target
    scrollStartRef.current = direction === 'vertical' ? scrollTop : scrollLeft
    checkPosition(false)
  }, [checkPosition, direction]);

  useScroll({
    ref: ref,
    wait: wait,
    onScrollStart: handleScrollStart,
    onScroll: handleScroll,
    isEnabled: isEnabled
  })

  return isEnabled ? {
    scrollStartRef: scrollStartRef,
    isAtStart: isAtStart,
    isAtEnd: isAtEnd,
    checkPosition: checkPosition
  } : {
    scrollStartRef: scrollStartRef,
    isAtStart: undefined,
    isAtEnd: undefined,
    checkPosition: noop
  }
}

useScrollPosition.defaultProps = {
  wait: 100,
  isEnabled: true,
  direction: 'vertical'
}


interface Props {
  ref: React.RefObject<any>
  wait?: number
  isEnabled?: boolean
  direction?: "vertical" | "horizontal"
}
