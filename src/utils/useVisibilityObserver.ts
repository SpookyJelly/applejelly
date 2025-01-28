import React from 'react'
import { useConditionalRefUpdate } from './hooks'

export const useVisibilityObserver = (targetRef, options = {}) => {
  const { visibilityOffset, isEnabled = true, onChange, rootRef, threshold } = options;
  const [isVisible, setIsVisible] = React.useState();
  const activeTargetRef = useConditionalRefUpdate(targetRef, isEnabled);
  const hasRootRef = Boolean(rootRef);
  const activeRootRef = useConditionalRefUpdate(rootRef || { current: null }, isEnabled);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  React.useEffect(() => {
    if (isEnabled && activeTargetRef && (!hasRootRef || activeRootRef)) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries.sort((a, b) => b.time - a.time).find(e => e.target === activeTargetRef);
        if (entry) {
          setIsVisible(entry.isIntersecting);
          onChangeRef.current?.(entry.isIntersecting, entry);
        }
      }, {
        root: activeRootRef,
        rootMargin: visibilityOffset ? `${visibilityOffset}px 0px` : undefined,
        threshold
      });

      observer.observe(activeTargetRef);
      return () => observer.disconnect();
    }
    setIsVisible(undefined);
  }, [isEnabled, visibilityOffset, activeTargetRef, activeRootRef, hasRootRef, threshold]);

  return isVisible;
};
