/**
 *
 * Popover
 *
 */

import React, { useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import cn from 'classnames'
import './popover.scss'
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingPortal,
    offset,
    Placement,
    shift,
    size,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react'
import { PopoverContext } from '@applejelly/context'
import Tooltip, { TooltipProps } from '@applejelly/components/dialogs/Tooltip'

const BLOCK = 'dialogs_popover'
const Popover = React.forwardRef(
    (
        {
            children,
            isPadded,
            isRounded,
            className,
            wrapperClassName,
            wrapperStyle,
            placement = 'bottom-start',
            onOpen,
            onClose,
            contents,
            offset: offsetValue = 10,
            width,
            isDefaultOpen = false,
            isHoverable,
            doesStickToEdges,
            tooltipProps,
            ...rest
        }: Props,
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(isDefaultOpen)
        const [isMouseOver, setIsMouseOver] = useState(false)
        const [maxHeight, setMaxHeight] = useState<number | null>(null)
        const arrowRef = useRef(null)

        const handleOpenChange = (
            nextOpen: boolean,
            event: unknown,
            reason: unknown
        ) => {
            setIsOpen(nextOpen)
            if (nextOpen) {
                onOpen?.(event)
            } else {
                onClose?.(reason)
            }
        }
        // setOpen이라는 이름으로 메서드를 외부로 노출해, 내부의 setIsOpen useState setter를 컨트롤 한다
        // useForwardRef 로 만들어진 컴포넌트에서만 사용 가능
        React.useImperativeHandle(ref, () => ({
            setPopOverOpen(value: boolean) {
                setIsOpen(value)
            },
        }))

        const { refs, floatingStyles, context } = useFloating({
            open: isOpen,
            onOpenChange: handleOpenChange,
            strategy: 'fixed',
            middleware: [
                arrow({ element: arrowRef }),
                offset(offsetValue),

                flip(),
                shift(),
                size({
                    apply(args) {
                        flushSync(() => {
                            return setMaxHeight(args.availableHeight)
                        })
                    },
                }),
            ],
            whileElementsMounted: autoUpdate,
        })

        const dismiss = useDismiss(context)
        const role = useRole(context, { role: 'tooltip' })

        const hoverInteraction = [
            useHover(context, { move: false }),
            useFocus(context),
            dismiss,
            role,
        ]
        const nonHoverInteraction = [useClick(context), dismiss, role]

        const interactionList = isHoverable
            ? hoverInteraction
            : nonHoverInteraction

        const { getReferenceProps, getFloatingProps } =
            useInteractions(interactionList)

        const classes = cn(BLOCK, {
            [`${BLOCK}--padded`]: isPadded,
        })

        const contentClasses = cn(`${BLOCK}__content`, {
            [`${BLOCK}__content--rounded`]: isRounded,
            [`${BLOCK}__content--does-stick-to-edges`]: doesStickToEdges,
        })

        const style = {
            ...floatingStyles,
            width: width ? `${width}px` : 'auto',
            maxHeight: maxHeight ? `${maxHeight}px` : 'auto',
            '--max-height': maxHeight ? `${maxHeight}px` : 'auto',
        }

        const handleMouseEnter = () => setIsMouseOver(true)
        const handleMouseLeave = () => setIsMouseOver(false)

        const childrenWithTooltip = tooltipProps ? (
            <PopoverContext.Provider
                value={{
                    ...context,
                    isMouseOver,
                }}
            >
                <Tooltip {...tooltipProps}>{children}</Tooltip>
            </PopoverContext.Provider>
        ) : (
            children
        )
        console.log('contents', contents)

        return (
            <>
                <div
                    ref={refs.setReference}
                    {...getReferenceProps({
                        onClick(event) {
                            event.stopPropagation()
                        },
                    })}
                    className={wrapperClassName}
                    style={{ display: 'inline-flex', ...wrapperStyle }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {childrenWithTooltip}
                </div>
                {isOpen && (
                    <FloatingPortal id="floating-portal">
                        <div
                            className={classes}
                            ref={refs.setFloating}
                            style={style}
                            {...getFloatingProps()}
                        >
                            <FloatingArrow
                                ref={arrowRef}
                                context={context}
                                fill="var(--ui-background)"
                                // stroke="var(--gray-500)"
                                // strokeWidth={1}
                            />
                            <div className={contentClasses}>{contents}</div>
                        </div>
                    </FloatingPortal>
                )}
            </>
        )
    }
)

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    isPadded?: boolean
    isRounded?: boolean
    isHoverable?: boolean
    wrapperClassName?: string
    wrapperStyle?: React.CSSProperties
    onOpen?: (event: unknown) => void
    onClose?: (reason: unknown) => void
    contents?: React.ReactNode
    offset?: number
    width?: number | string
    isDefaultOpen?: boolean
    doesStickToEdges?: boolean
    tooltipProps?: TooltipProps
    ref?: React.Ref<unknown>
    placement?: Placement
}

export default Popover
export type { Props as PopoverProps }
