import React, { useCallback, useEffect } from "react";
import { useEventListener } from "./useEventListener";
import { debounce } from "lodash";

interface ScrollProps {
  ref: any;
  onScroll?: (event: any) => void;
  onScrollStart?: (event: any) => void;
  onScrollEnd?: (event: any) => void;
  wait?: number;
  isEnabled?: boolean;
}

export function useScroll(props) {
  const {
    ref,
    onScroll,
    onScrollStart,
    onScrollEnd,
    wait = 200,
    isEnabled = true
  } = props

  const handleScrollStart: p = React.useMemo((function() {
    return onScrollStart ? debounce(onScrollStart, wait, {
      leading: true,
      trailing: false
    }) : undefined
  }), [onScrollStart, wait])

  const handleScrollEnd: m = React.useMemo((function() {
    return onScrollEnd ? debounce(onScrollEnd, wait) : undefined
  }), [onScrollEnd, wait])

  const handler: f = React.useCallback((function(event) {
    onScroll && onScroll(event)
    handleScrollStart && handleScrollStart(event)
    handleScrollEnd && handleScrollEnd(event)
  }), [onScroll, handleScrollStart, handleScrollEnd]);

  useEventListener("scroll", handler, ref, !isEnabled)
}
