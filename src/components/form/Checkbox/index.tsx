/**
 *
 * Checkbox
 *
 */

import React from 'react'
import cn from 'classnames'
import Icon from '@applejelly/components/common/Icon'
import './checkbox.scss'
import { TSHIRT_SIZE } from '@applejelly/style/constant'
import { IconsProps } from '@storybook/components'
import Overflower from '@applejelly/components/layout/Overflower'
const BLOCK = 'form_checkbox'
function Checkbox({
    isDisabled = false,
    isChecked,
    isReadOnly = false,
    onChange = () => {},
    isIndeterminate = false,
    // inputAttributes,
    id,
    size = 'md',
    value,
    label,
    hasOverflower,
    isMultiline,
    ...rest
}: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const classes = cn(
        BLOCK,
        {
            [`${BLOCK}--is-checked`]: isChecked,
            [`${BLOCK}--is-disabled`]: isDisabled,
            [`${BLOCK}--is-readonly`]: isReadOnly,
        },
        rest.className
    )

    const iconName = React.useMemo(() => {
        if (isIndeterminate) return 'minusSquared'
        if (isChecked) return 'checkboxChecked'
        return 'checkboxUnchecked'
    }, [isIndeterminate, isChecked])

    // const sizeValue = size === 'inherit' ? undefined : size || 'md'

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = isIndeterminate
        }
    }, [isIndeterminate])

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement
        if (!target.classList.contains('focus-visible')) {
            e.stopPropagation()
        }
    }
    const _hasOverflower =
        hasOverflower || !isMultiline || 'string' == typeof label
    const LabelInner: React.ElementType = _hasOverflower ? Overflower : 'span'

    return (
        <span {...rest} className={classes} tabIndex={-1}>
            <input
                ref={inputRef}
                className={cn(`${BLOCK}__input`)}
                id={id}
                checked={isChecked}
                onChange={onChange}
                // {...inputAttributes}
                type="checkbox"
            />
            <Icon
                name={iconName}
                size={size}
                className={`${BLOCK}__icon checkbox__icon`}
            />

            {label && (
                <LabelInner className={`${BLOCK}__label`}>{label}</LabelInner>
            )}
        </span>
    )
}

Checkbox.defaultProps = {}

interface Props extends React.HTMLAttributes<HTMLInputElement> {
    id?: string
    hasBaselineAlign?: boolean
    hasOverflower?: boolean
    isMultiline?: boolean
    isChecked?: boolean
    isDisabled?: boolean
    isReadOnly?: boolean
    isIndeterminate?: boolean
    label?: React.ReactNode
    size: TSHIRT_SIZE | 'inherit'
    // inputAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value: string
}

export default Checkbox
export type { Props as CheckboxProps }
