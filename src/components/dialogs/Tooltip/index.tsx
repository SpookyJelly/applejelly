/**
 *
 * Tooltip
 *
 */

import React, { useState, useContext, useRef } from 'react'
import cn from 'classnames'
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    Placement,
    arrow,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    useTransitionStyles,
    useFloatingNodeId,
    FloatingNode,
} from '@floating-ui/react'
import * as R from 'ramda'
import './tooltip.scss'

// context functions for tooltip
const Nested = React.createContext<any>(undefined)
const isVaildElement = (element: React.ReactNode) => !R.isEmpty(element)

const getDuration = (isAnimated: boolean, delay: 'none' | 'short' | 'long') => {
    if (!isAnimated || delay === 'none') return 0
    if (delay === 'short') {
        return 150
    } else if (delay === 'long') {
        return 300
    }
}

const PopoverContext = React.createContext(null)

const BLOCK = 'dialogs_tooltip'
function Tooltip({
    onClick,
    content,
    isEnabled = true,
    placement = 'top',
    delay = 'none',
    display = 'inline-block',
    ...rest
}: Props) {
    const [isOpen, setIsOpen] = useState(rest.isOpen)
    const arrowRef = useRef(null)
    const popoverContext = useContext(PopoverContext)

    const getOpen = () => {
        if (popoverContext?.open) {
            return false
        }
        return rest.isOpen || isOpen
    }

    const { refs, floatingStyles, context } = useFloating({
        open: getOpen(),
        onOpenChange: setIsOpen,
        placement: placement,
        strategy: 'fixed',
        elements: {},
        whileElementsMounted: autoUpdate,
        middleware: [arrow({ element: arrowRef }), offset(7), flip(), shift()],
    })

    //Event listeners to change the open state
    const hover = useHover(context, {
        move: false,
    })
    const focus = useFocus(context)
    const dismiss = useDismiss(context)

    const role = useRole(context, { role: 'tooltip' })
    const refElement = rest.triggerTarget

    React.useEffect(() => {
        if (refElement) {
            refs.setPositionReference(refElement)
        }
    }, [refElement])

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ])

    const { isMounted, styles } = useTransitionStyles(context, {
        duration: getDuration(rest.isAnimated, delay),
    })

    const id = useFloatingNodeId()
    const childArray = React.Children.toArray(rest.children)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [other, tooltips] = R.partition((e: any) => {
        const propsDiffer = R.difference(
            ['placement', 'isEnabeld', 'isAnimated', 'display'],
            R.keys(e.props)
        )
        return propsDiffer.length > 0
    }, childArray)

    const nestedContents = useContext(Nested)
    const contentsArr = [nestedContents, content]

    const handleClick = () => setIsOpen(false)
    const isContentEmpty = R.isNil(content)
    return (
        <>
            <FloatingNode id={id}>
                <div className={cn(BLOCK, rest.className)}>Test</div>
            </FloatingNode>
        </>
    )
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    contents?: React.ReactNode
    delay: 'none' | 'short' | 'long'
    isEnabled: boolean
    isAnimated: boolean
    isOpen?: boolean
    placement: Placement
    tooltipClassName?: string
    triggerTarget?: Element

    //Lifecycle Hooks
    onHide?: (instance: unknown) => void
    onShow?: (instance: unknown) => void

    display: 'inline' | 'inline-flex' | 'flex' | 'grid' | 'inline-block'
}

export default Tooltip
