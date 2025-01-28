import React from 'react'
import { useVisibilityObserver } from './useVisibilityObserver'

const NumberAndPercentBarContext = React.createContext({
  currentValues: {},
  hasNoUnwrap: false,
});

const getColumnWrapperClass = columnId => `--column-${sanitizeStringWithUnderscore(columnId)}--is-wrapping`

export function useNumberAndPercentBarContext() {
  const [wrapperClasses, setWrapperClasses] = React.useState({});

  function handleValueSubmission(columnId, shouldAdd, callback) {
    let currentValues = contextValue.current.currentValues;
    if (shouldAdd) {
      if (currentValues[columnId]) {
        currentValues[columnId] += 1;
      } else {
        currentValues[columnId] = 1;
        setWrapperClasses(prevClasses => ({
          ...prevClasses,
          [getColumnWrapperClass(columnId)]: 1,
        }));
        callback(true);
      }
    } else {
      let shouldRemove = false;
      if (currentValues[columnId] && !contextValue.current.hasNoUnwrap) {
        callback(false);
        currentValues[columnId] -= 1;
        if (currentValues[columnId] === 0) shouldRemove = true;
      }
      if (shouldRemove || currentValues[columnId] === undefined) {
        setWrapperClasses(prevClasses => {
          const newClasses = { ...prevClasses };
          delete newClasses[getColumnWrapperClass(columnId)];
          return newClasses;
        });
      }
    }
  }

  const contextValue = React.useRef({
    submitValue: handleValueSubmission,
    currentValues: {},
    hasNoUnwrap: false,
  });

  return [
    React.useCallback(({ children, isEnabled = true, hasNoUnwrap = false }) => {
      contextValue.current.hasNoUnwrap = hasNoUnwrap;
      return isEnabled ? (
        <NumberAndPercentBarContext.Provider value={contextValue.current}>
          {children}
        </NumberAndPercentBarContext.Provider>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      );
    }, []),
    wrapperClasses
  ];
}


export function useColumnWrappingContext(columnId) {
  const rootRef = React.useRef(null)
  const visibilityHelperRef = React.useRef(null)
  const {
    submitValue,
    hasNoUnwrap,
    currentValues
  } = React.useContext(NumberAndPercentBarContext)

  const isColumnUnwrappable = Boolean(columnId && hasNoUnwrap && currentValues[columnId])
  const shouldListenToVisibility = Boolean(columnId && submitValue && !isColumnUnwrappable)
  const isWrapping = false === useVisibilityObserver(visibilityHelperRef, {
    rootRef,
    isEnabled: shouldListenToVisibility
  })
  const [isEnforcedWrapping, setIsEnforcedWrapping] = React.useState(false)

  React.useEffect((function() {
    isColumnUnwrappable || columnId && submitValue && submitValue(columnId, isWrapping, setIsEnforcedWrapping)
  }), [submitValue, isWrapping, isColumnUnwrappable])

  React.useEffect((function() {
    return function() {
      isColumnUnwrappable || submitValue && columnId && submitValue(columnId, false, setIsEnforcedWrapping)
    }
  }), [submitValue, columnId, isColumnUnwrappable])

  return {
    rootRef,
    enforcedWrappingValue: columnId && !isEnforcedWrapping ? `var(${getColumnWrapperClass(columnId)}, 0)` : undefined,
    visibilityHelperRef,
    shouldListenToVisibility,
    isWrapping
  }
}
