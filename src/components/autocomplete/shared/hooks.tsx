import React, { useState, useEffect } from "react";
export function useAnyVisible(
  ref: React.RefObject<HTMLElement>,
  dependencies: NodeListOf<Element>,
) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const isAnyVisible = entries.some(
          (entry) => entry.intersectionRatio < 1,
        );
        setIsVisible(isAnyVisible);
      },
      { root: ref.current, rootMargin: "0px", threshold: 0 },
    );
    dependencies.forEach((dependency) => {
      observer.observe(dependency);
    });

    return () => observer.disconnect();
  }, [ref, dependencies]);

  return isVisible;
}
