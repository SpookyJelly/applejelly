import React from 'react'
import { collectMatchingElements }  from './base'


const isBodyOrPositionedElement = (element) => {
  return element === document.body || window.getComputedStyle(element).position !== "static";
}

const findSingleMatchingElement = function(element) {
  const collection = collectMatchingElements(element, isBodyOrPositionedElement);
  return collection.length !== 1 ? null : collection[0]
}

const onClickDefault = function(event) {
  event.stopPropagation()
}

const noop = function() {}


export function useCoordinates(props = {}) {
  const {
    key,
    positionRelativeTo,
    onClick = onClickDefault
  } = props

  const [coordinates, setCoordinates] = React.useState(null)
  const [context, setContext] = React.useState()
  const resetCoordinates = React.useCallback((function() {
    return setCoordinates(null)
  }), []);

  React.useEffect((function() {
    if (key !== undefined && resetCoordinates) {
      resetCoordinates()
    }
  }), [key, resetCoordinates]);

  const handleClick = React.useCallback((function(event) {
    const parent = findSingleMatchingElement(event.currentTarget);
    setContext(parent)
    setCoordinates(function(_event, prt = "context", domElement = findSingleMatchingElement(parent)) {
      const {
        currentTarget,
        clientX,
        clientY
      } = _event

      if (!domElement) return null;
      const clientRect = domElement.getBoundingClientRect()
      const left = clientRect.left
      const top = clientRect.top;

      return clientX === 0 && clientY === 0 ? {
        x: 0,
        y: 0
      } : {
        x: clientX - ("window" !== prt ? left : 0),
        y: clientY - ("window" !== prt ? top : 0)
      }
    }(event, positionRelativeTo, parent))

    onClick && onClick(event)
  }), [positionRelativeTo, onClick]);

  return {
    coordinates: coordinates,
    context: context,
    onClick: handleClick,
    onClose: resetCoordinates,
    setCoordinates: setCoordinates
  }
}

export const CoordinatesContext = React.createContext({
  update: noop,
  setTooltipOnClose: noop
})
