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

const BLOCK = 'dialogs_popover'
const Popover = React.forwardRef(
    (
        {
            children,
            isPadded,
            isRounded,
            className,
            wrapperClassName,
            placement,
            onOpen,
            onClose,
            content,
            offset: offsetValue,
            width,
            isDefaultOpen,
            isHoverable,
            doesStickToEdges,
            tooltipProps,
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

        // const childrenWithTooltip = tooltipProps ? (
        // ) : (
        //     children
        // )

        return <div>test</div>
    }
)
// function Popover(props: Props) {

//     return <div>Popover</div>
// }

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    isPadded?: boolean
    isRounded?: boolean
    isHoverable?: boolean
    wrapperClassName?: string
    wrapperStyle?: React.CSSProperties
    onOpen?: (event: unknown) => void
    onClose?: (reason: unknown) => void
    content?: React.ReactNode
    offset?: number
    width?: number | string
    isDefaultOpen?: boolean
    doesStickToEdges?: boolean
    tooltipProps?: TooltipProps
    ref?: React.Ref<unknown>
    placement?: Placement
}

export default Popover
