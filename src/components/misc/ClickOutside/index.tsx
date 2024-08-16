/**
 *
 * ClickOutside
 *
 */

import React from 'react'
import cn from 'classnames'
import './clickOutside.scss'

const BLOCK = 'misc_clickoutside'

export const useClickOutsideProps = ({
    isDisabled,
    scope,
    onClick,
}: Pick<Props, 'isDisabled' | 'scope' | 'onClick'>) => {
    const lastEventTimeStamp = React.useRef<undefined | number>()
    const isEventSetUp = React.useRef(false)
    const customEvent = React.useRef(new WeakSet())
    const onMouseDownEventSet = React.useRef(new WeakSet())
    const onMouseUpEventSet = React.useRef(new WeakSet())

    const isOutsideClick = React.useCallback(
        (event: MouseEvent, eventSet: WeakSet<object>) => {
            return (
                lastEventTimeStamp.current &&
                event.timeStamp > lastEventTimeStamp.current &&
                !eventSet.has(event)
            )
        },
        []
    )
    const handleCustomEvent = React.useCallback(
        (event: unknown) => {
            if (event instanceof CustomEvent && scope === event.detail.scope) {
                customEvent.current.add(event.detail.event)
            }
        },
        [scope]
    )

    const onClickRef = React.useRef(onClick)
    onClickRef.current = onClick

    React.useEffect(() => {
        if (isDisabled) return

        const handleMouseDown = (event: MouseEvent) => {
            if (customEvent.current.has(event)) {
                customEvent.current.delete(event)
                return
            } else {
                if (
                    !isEventSetUp.current &&
                    isOutsideClick(event, onMouseDownEventSet.current)
                ) {
                    window.addEventListener('mouseup', handleMouseUp)
                    isEventSetUp.current = true
                }
            }
        }

        const handleMouseUp = (event: MouseEvent) => {
            if (isOutsideClick(event, onMouseUpEventSet.current)) {
                onClickRef.current(
                    event as unknown as React.MouseEvent<Element, MouseEvent>
                )
            }
            window.removeEventListener('mouseup', handleMouseUp)
            isEventSetUp.current = false
        }

        lastEventTimeStamp.current = performance.now()
        document.addEventListener('customEventIdentifier', handleCustomEvent)
        window.addEventListener('mousedown', handleMouseDown)

        return () => {
            document.removeEventListener(
                'customEventIdentifier',
                handleCustomEvent
            )
            window.removeEventListener('mousedown', handleMouseDown)
            if (isEventSetUp.current) {
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDisabled, isOutsideClick])

    return {
        onMouseDown: React.useCallback(
            (event: React.SyntheticEvent) => {
                if (!isDisabled) {
                    onMouseDownEventSet.current.add(event.nativeEvent)
                }
            },
            [isDisabled]
        ),
        onMouseUp: React.useCallback(
            (event: React.SyntheticEvent) => {
                if (!isDisabled)
                    onMouseUpEventSet.current.add(event.nativeEvent)
            },
            [isDisabled]
        ),
    }
}

function ClickOutside({
    isDisabled,
    scope,
    onClick,
    children,
    as,
    className,
    style,
    ...rest
}: Props) {
    const clickOutsideProps = useClickOutsideProps({
        isDisabled,
        scope,
        onClick,
    })
    const Component = as || 'div'
    return (
        <Component
            {...clickOutsideProps}
            style={style}
            className={cn(BLOCK, className)}
        >
            {children}
        </Component>
    )
}

ClickOutside.defaultProps = {}

interface Props {
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    as?: keyof JSX.IntrinsicElements
    onClick: (event: React.MouseEvent) => void
    isDisabled?: boolean
    scope?: string
}

export default ClickOutside
export type { Props as ClickOutsideProps }
