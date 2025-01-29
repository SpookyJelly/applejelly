/**
 *
 * ControlledPopoverButton
 *
 */
//@ts-nocheck
import React from 'react'
import classNames from 'classnames'
import Popover, { PopoverProps } from '../Popover'
import Button from '../../form/Button'
import { MarginProps, PaddingProps, getBaseProps } from '../../../helpers'
import type { TSHIRT_SIZE } from '../../../helpers'
import './controlled-popover-button.scss'
import icons from '@applejelly/style/icons'

function ControlledPopoverButton(props: Props) {
    const {
        onOpen,
        onClose,
        children,
        popoverClassName,
        wrapperClassName,
        stopPropagationOnHandleClick,
        willCloseOnClick,
        isPadded,
        tooltipProps,
        placement,
        isArrowHidden,
        isPopoverSpaced,
        isHoverable,
        delay,
        offset,
        renderedRelativeTo,
        shouldCloseOtherPopoversOnOpen,
        icon,
        label,
        size,
        level,
        isNaked,
        isDangerouslyNaked,
        isFullWidth,
        isOpen,
        doesStickToEdges,
        width,
        isActive = isOpen,
        isRounded,
        ...rest
    } = props

    const [extraClasses, restProps] = getBaseProps(
        {
            icon,
            label,
            size,
            level,
            isDangerouslyNaked: isDangerouslyNaked
                ? isDangerouslyNaked
                : isNaked,
            isFullWidth,
            ...rest,
        },
        ['margin']
    )

    return (
        <Popover
            wrapperClassName={classNames(wrapperClassName, extraClasses, {
                'popover-button--is-full-width': isFullWidth,
            })}
            popoverClassName={popoverClassName}
            isPadded={isPadded}
            placement={placement}
            isArrowHidden={isArrowHidden}
            isPopoverSpaced={isPopoverSpaced}
            renderedRelativeTo={renderedRelativeTo}
            shouldCloseOtherPopoversOnOpen={shouldCloseOtherPopoversOnOpen}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            willCloseOnClick={willCloseOnClick}
            stopPropagationOnHandleClick={stopPropagationOnHandleClick}
            isHoverable={isHoverable}
            offset={offset}
            tooltipProps={tooltipProps}
            doesStickToEdges={doesStickToEdges}
            width={width}
            isRounded={isRounded}
            delay={delay}
            contents={children}
        >
            <Button {...restProps} isActive={isActive} />
        </Popover>
    )
}

ControlledPopoverButton.defaultProps = {
    willCloseOnClick: true,
    placement: 'bottom-end',
    icon: 'cog',
    label: '',
    size: 'md',
    level: 'default',
    isBorderless: true,
    isPadded: true,
}

interface Props extends ControlledPopoverButtonProps {}

export interface ControlledPopoverButtonProps extends PopoverProps {
    popoverClassName?: string
    stopPropagationOnHandleClick?: boolean
    willCloseOnClick?: boolean
    isArrowHidden?: boolean
    isPopoverSpaced?: boolean
    delay?: 'none' | 'short' | 'long'
    renderedRelativeTo?: 'context' | 'end-of-body'
    shouldCloseOtherPopoversOnOpen?: boolean
    icon?: keyof typeof icons
    label?: string
    size?: TSHIRT_SIZE
    level?: any
    isNaked?: boolean
    isDangerouslyNaked?: boolean
    isFullWidth?: boolean
    isOpen?: boolean
    isActive?: boolean
    isRounded?: boolean
}

export default ControlledPopoverButton
