import React from 'react'
import { isFunction } from 'lodash'
import copyClipboard from "copy-to-clipboard"
import { useShortcut } from "./useShortcut"
import { useMount } from "./hooks"
import KeyboardShortcut from "../components/typography/KeyboardShortcut"

const CLICK_TO_COPY = "Click to copy"
const COPIED_TO_CLIPBOARD = "Copied to clipboard!"

export const MESSAGE_COPY = CLICK_TO_COPY
export const MESSAGE_COPIED = COPIED_TO_CLIPBOARD

export const useCopyAction = (props) => {
  const {
    value,
    formattedValue,
    messageCopy = CLICK_TO_COPY,
    messageCopied = COPIED_TO_CLIPBOARD,
    hasShortcut = true,
    shortcutOptions,
    onClick,
    onMouseDown,
    shouldStopPropagation = false
  } = props

  const shortcutOptionsValue = {
    shortcut: "mod+c",
    elementReferer: undefined,
    canBypassFocus: true,
    ...shortcutOptions
  }

  const keyboardKey = ("string" == typeof shortcutOptionsValue.shortcut ? shortcutOptionsValue.shortcut : shortcutOptionsValue.shortcut[0]).split("+")
  const keyboardShortcut = <KeyboardShortcut size='xs' keys={keyboardKey} variant="knockout" />
  const renderMsg = () => {
    if (typeof messageCopy == "function") {
      return messageCopy({
        MESSAGE_COPY: CLICK_TO_COPY,
        shortcut: keyboardShortcut
      })
    }
    return hasShortcut ? <>{messageCopy}{' '}<br />{keyboardShortcut}</> : messageCopy
  }

  const [msg, setMsg] = React.useState(renderMsg())
  const [isEnabled, setIsEnabled] = React.useState(false)
  const enabledRef = React.useRef(isEnabled)

  enabledRef.current = isEnabled

  useShortcut("esc", function() {
    setIsEnabled(false)
    return false
  }, {
    canBypassFocus: true,
    isEnabled
  });

  const isMount = useMount()
  const timeoutRef = React.useRef<number | null>(null)

  const handleClick = (event) => {
    if(shouldStopPropagation) {
      event.preventDefault()
      event.stopPropagation()
    }
    onClick && onClick(event)

    const requestIdleAction = async () => {
      const _value = isFunction(value) ? value() : value

      const copiedValue = await copyClipboard(_value, {
        format: "text/plain",
        onCopy: event => {
          const finalValue = isFunction(formattedValue) ? formattedValue(_value) : formattedValue;
          finalValue && event.setData("text/html", finalValue)
        }
      })

      const afterAction = () => {
        setMsg("")
        setIsEnabled(true)
        timeoutRef.current !== null && window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(function() {
          if (isMount.current) {
            setMsg(renderMsg())
            setIsEnabled(false)
          }
        }, 12e2)
      }

      if (copiedValue) {
        enabledRef.current || afterAction()
        setMsg(messageCopied)
      }
    }

    window.requestIdleCallback(requestIdleAction, {
      timeout: 500
    })
  }
  const handleMouseEnter = function() {
    setIsEnabled(true)
    setMsg(renderMsg())
  }

  const handleMouseLeave = function() {
    setIsEnabled(false)
    setMsg(renderMsg())
  };

  const shortcutOption = {
    canBypassFocus: shortcutOptionsValue.canBypassFocus,
    elementReferer: shortcutOptionsValue.elementReferer,
    isEnabled: hasShortcut && value !== undefined && Boolean(shortcutOptionsValue.elementReferer)
  }

  useShortcut(shortcutOptionsValue.shortcut, handleClick, shortcutOption)

  return value === undefined ? {
    tooltipProps: {},
    handleProps: {}
  } : {
    tooltipProps: {
      isOpen: isEnabled,
      content: msg
    },
    handleProps: {
      onClick: handleClick,
      onMouseDown: (event) => {
        shouldStopPropagation && event.preventDefault()
        onMouseDown && onMouseDown(event)
      },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleMouseEnter,
      onBlur: handleMouseLeave
    }
  }
}
