/**
 *
 * Checkbox
 *
 */

import React, { useEffect } from 'react'
import Text from '@applejelly/components/typography/Text'
import Flex from '@applejelly/components/layout/Flex'
import cn from 'classnames'
import Icon from '@applejelly/components/common/Icon'
import './checkbox.scss'
import { TSHIRT_SIZE } from '@applejelly/style/constant'
import { IconsProps } from '@storybook/components'
import Overflower from '@applejelly/components/layout/Overflower'
import { getBasePropsClassnames, omitBaseProps } from '@applejelly/helpers'
const BLOCK = 'AJ-form_checkbox'
function Checkbox({
    isDisabled = false,
    isChecked,
    isReadOnly = false,
    onChange = () => {},
    isIndeterminate = false,
    // inputAttributes,
    id,
    size = 'xxl',
    value,
    label,
    hasOverflower,
    isMultiline,
    ...rest
}: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const marginClasses = getBasePropsClassnames(rest, ['margin'])
    const classes = cn(
        BLOCK,
        {
            [`${BLOCK}--is-checked`]: isChecked,
            [`${BLOCK}--is-disabled`]: isDisabled,
            [`${BLOCK}--is-readonly`]: isReadOnly,
        },
        marginClasses,
        rest.className
    )
    const sizeValue = size
    const restProps = omitBaseProps(rest, ['margin'])

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
    const LabelInner = _hasOverflower ? Overflower : 'span'

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = isIndeterminate
        }
    }, [isIndeterminate])

    useEffect(() => {
        // useFocusVisible
    }, [])

    console.log('size', sizeValue)

    return (
        <Text {...restProps} as="label" size={sizeValue} className={classes}>
            <input
                ref={inputRef}
                className={cn(`${BLOCK}__input`, rest.inputClassName)}
                id={id}
                defaultValue={value || (isChecked ? 'on' : 'off')}
                checked={isChecked}
                onChange={onChange}
                type="checkbox"
                aria-readonly={isDisabled || isReadOnly}
                disabled={isDisabled}
                readOnly={isDisabled || isReadOnly || !onChange}
                onClick={handleClick}
                {...rest}
            />
            <Flex
                alignItems={'center'}
                isInline
                className={`${BLOCK}__label`}
                style={{ minWidth: 12 }}
            >
                <Icon
                    name={iconName}
                    size={sizeValue}
                    className={`${BLOCK}__icon checkbox__icon`}
                />
                {label && (
                    <LabelInner marginLeft="xs" size={sizeValue}>
                        {label}
                    </LabelInner>
                )}
            </Flex>
        </Text>
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
    inputClassName?: string
}

export default Checkbox
export type { Props as CheckboxProps }
