/**
 *
 * Button
 *
 */

import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import './button.scss'
import { TSHIRT_SIZE } from '@applejelly/style/constant'
import icons from '@applejelly/style/icons'
import Icon from '@applejelly/components/common/Icon'

const BLOCK = 'form_button'

const IconElement = ({
    isLoading,
    icon,
    iconClassName,
    shouldScaleIcon,
}: {
    isLoading: Props['isLoading']
    icon: Props['icon']
    iconClassName?: string
    shouldScaleIcon: boolean
}) => {
    if (isLoading) {
        // TODO:
        return <p>Loading...</p>
    }
    if (icon) {
        return (
            <Icon
                name={icon}
                title=""
                size={'md'}
                fill="currentColor"
                isScaleDown={shouldScaleIcon}
                className={cn(`${BLOCK}__icon`, iconClassName)}
            />
        )
    }

    return null
}

function Button({
    className,
    autoFocus,
    label,
    href,
    isExternal,
    level = 'default',
    isPrimary,
    isBorderless,
    isDangerouslyNaked,
    isNaked,
    isShade,
    isFullWidth,
    isActive,
    isHovered,
    isLoading,
    isDisabled,
    type,
    title,
    hasEllipsis,
    innerRef,
    size = 'md',
    icon,
    featureStatus,
    iconPosition,
    ...rest
}: Props) {
    const [isHoveredState, setIsHoveredState] = useState(false)

    //   const contextSize = getContextSizeOrSize('md')
    // const sizeValue = size  || contextSize

    const isButtonActive = isPrimary || isActive
    // const iconPosition = 'left' // FIX it later
    const iconClassName = label
        ? `${BLOCK}__icon--position-${iconPosition}`
        : ''
    const shouldScaleIcon =
        !(isBorderless || isDangerouslyNaked || isNaked) || !label

    return (
        <button
            className={cn(
                BLOCK,
                `${BLOCK}--${size}`,
                `${BLOCK}--${level}`,
                BLOCK + '--default',
                {
                    [`${BLOCK}--is-primary`]: isButtonActive,
                    [`${BLOCK}--is-active`]: isActive,
                    [`${BLOCK}--has-icon-only`]: !label,
                    [`${BLOCK}--is-borderless`]: isBorderless || isShade,
                    [`${BLOCK}--is-naked`]: isNaked,
                    [`${BLOCK}--is-shade`]: isShade,
                    [`${BLOCK}--is-full-width`]: isFullWidth,
                    [`${BLOCK}--is-hovered`]: isHoveredState,
                    [`${BLOCK}--is-disabled`]: isDisabled || isLoading,
                }
            )}
            disabled={isDisabled || isLoading}
            ref={innerRef}
            autoFocus={autoFocus}
            title={title}
            type={type}
            onPointerEnter={() => setIsHoveredState(true)}
            onPointerLeave={() => setIsHoveredState(false)}
            {...rest}
        >
            <IconElement
                icon={icon}
                isLoading={isLoading}
                iconClassName={iconClassName}
                shouldScaleIcon={shouldScaleIcon}
            />
            <span
                className={cn(`${BLOCK}__content`, {
                    __ellipsis: hasEllipsis,
                })}
            >
                {label}
            </span>
        </button>
    )
}

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    size: TSHIRT_SIZE
    href?: string
    isExternal?: boolean
    level?: 'default' | 'success' | 'warning' | 'danger'
    icon?: keyof typeof icons
    iconPosition?: 'left' | 'right'
    isBorderless?: boolean
    isDangerouslyNaked?: boolean
    // 둘은 딱히 필요가
    isNaked?: boolean
    isShade?: boolean
    //
    isFullWidth?: boolean
    isActive?: boolean
    isHovered?: boolean
    isLoading?: boolean
    isDisabled?: boolean
    isPrimary?: boolean
    label?: string

    featureStatus?: string

    type?: 'button' | 'submit' | 'reset'
    // iconProps;
    innerRef?: React.Ref<HTMLButtonElement>
    hasEllipsis?: boolean
}

export default Button
