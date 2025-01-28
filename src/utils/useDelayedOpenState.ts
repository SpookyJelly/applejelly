import React, { useState, useEffect, useRef } from 'react';

export const useDelayedOpenState = ({ isOpen, hasTransition }: UseDelayedOpenStateProps) => {
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);
  const previousOpenState = useRef(isOpen);

  useEffect(() => {
    const wasPreviouslyOpen = previousOpenState.current;
    previousOpenState.current = isOpen;

    if (!isOpen) {
      return setIsCurrentlyOpen(false);
    }

    if (!hasTransition || wasPreviouslyOpen) {
      return setIsCurrentlyOpen(true);
    }

    setIsCurrentlyOpen(false);

    const transitionTimeout = setTimeout(() => {
      setIsCurrentlyOpen(true);
    }, 180);

    return () => {
      clearTimeout(transitionTimeout);
    };
  }, [hasTransition, isOpen]);

  return isCurrentlyOpen;
};


interface UseDelayedOpenStateProps {
  isOpen: boolean
  hasTransition: boolean
}
