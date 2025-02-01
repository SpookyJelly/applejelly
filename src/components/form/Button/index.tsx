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
import LoadingIndicator from '@applejelly/components/misc/LoadingIndicator'
import { background } from '@storybook/theming'

const ROOT = 'form_button'

const IconElement = ({
    isLoading,
    icon,
    iconClassName,
    shouldScaleIcon,
    size = 'md',

    isHighlighted,
}: {
    isLoading: Props['isLoading']
    icon: Props['icon']
    iconClassName?: string
    shouldScaleIcon: boolean
    size: Props['size']
    isHighlighted: boolean
}) => {
    const highlightStyle = {
        backgroundColor: 'initial',
        boxShadow: 'none',
    }
    if (isLoading) {
        return <LoadingIndicator size={size} className={cn(`${ROOT}__icon`)} />
    }
    if (icon) {
        return (
            <div className={cn(ROOT + '__icon-wrapper')}>
                <Icon
                    style={isHighlighted ? highlightStyle : {}}
                    name={icon}
                    title=""
                    size={size}
                    fill="currentColor"
                    isScaleDown={shouldScaleIcon}
                    className={cn(`${ROOT}__icon`, iconClassName, 'icon')}
                />
            </div>
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
    iconPosition = 'left',
    ariaAttrs,
    dataAttrs,
    ariaLabel = ariaAttrs ? ariaAttrs['aria-label'] : undefined,
    ...rest
}: Props) {
    const [isHoveredState, setIsHoveredState] = useState(false)

    //   const contextSize = getContextSizeOrSize('md')
    // const sizeValue = size  || contextSize

    const isButtonActive = isPrimary || isActive
    const iconClassName = label ? `${ROOT}__icon--position-${iconPosition}` : ''
    const shouldScaleIcon =
        !(isBorderless || isDangerouslyNaked || isNaked) || !label

    const buttonProps = {
        ...ariaAttrs,
        ...dataAttrs,
        'aria-label': ariaLabel,
        className: cn(
            ROOT,
            `${ROOT}--${size}`,
            `${ROOT}--${level}`,
            // extraClasses,
            {
                // [`${ROOT}--has-icon-only`]: !label && !featureStatusLabel,
                [`${ROOT}--has-icon-only`]: !label,
                [`${ROOT}--has-ellipsis`]: hasEllipsis,
                [`${ROOT}--is-borderless`]: isBorderless || isShade,
                [`${ROOT}--is-naked`]:
                    (isDangerouslyNaked || isNaked) && !isShade,
                [`${ROOT}--is-primary`]: isButtonActive,
                [`${ROOT}--is-shade`]: isShade,
                [`${ROOT}--is-full-width`]: isFullWidth,
                [`${ROOT}--is-active`]: isActive,
                [`${ROOT}--is-hovered`]: isHoveredState,
                [`${ROOT}--is-disabled`]: isDisabled || isLoading,
            },
            className
        ),
        title,
        type,
        disabled: isDisabled || isLoading,
        autoFocus,
        ref: innerRef,
        onPointerEnter: () => setIsHoveredState(true),
        onPointerLeave: () => setIsHoveredState(false),
        ...rest,
    }

    // if (isLoading) {
    //     <LoadingIndicator size={size} className={cn(`${ROOT}`)} />
    // }

    return (
        <button {...buttonProps}>
            <IconElement
                icon={icon}
                isLoading={isLoading}
                iconClassName={iconClassName}
                shouldScaleIcon={shouldScaleIcon}
                size={size}
                isHighlighted={Boolean(isHovered || isActive)}
                // isHovered={isHovered}
                // isActive={isActive}
            />
            <span
                className={cn(`${ROOT}__content`, {
                    __ellipsis: hasEllipsis,
                })}
            >
                {label}
            </span>
            {rest.children && (
                <span className={cn(`${ROOT}__children`)}>{rest.children}</span>
            )}
        </button>
    )
}

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    size?: TSHIRT_SIZE
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

    // DOM PROPS
    ariaAttrs?: React.AriaAttributes
    dataAttrs?: Record<`data-${string}`, string>
    ariaLabel?: string
}

export default Button
export type { Props as ButtonProps }
