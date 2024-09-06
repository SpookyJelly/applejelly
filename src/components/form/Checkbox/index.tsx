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

const BLOCK = 'form_checkbox'
function Checkbox({
    isDisabled = false,
    isChecked = false,
    isReadOnly = false,
    onChange = () => {},
    isIndeterminate = false,
    inputAttributes,
    id,
    value,
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

    const iconName = React.useMemo<IconsProps['name']>(() => {
        if (isIndeterminate) return 'minusSqared'
        if (isChecked) return 'checkboxChecked'
        return 'checkboxUnchecked'
    }, [isIndeterminate, isChecked])

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

    return (
        <span {...rest} className={classes} tabIndex={-1}>
            <input
                ref={inputRef}
                className={cn(`${BLOCK}__input`)}
                id={rest.id}
                {...inputAttributes}
            />
        </span>
    )
}

Checkbox.defaultProps = {}

interface Props extends React.HTMLAttributes<HTMLLabelElement> {
    id?: string
    hasBaselineAlign?: boolean
    //hasOverflower
    isChecked?: boolean
    isDisabled?: boolean
    isReadOnly?: boolean
    isIndeterminate?: boolean
    label?: React.ReactNode
    size: TSHIRT_SIZE | 'inherit'
    inputAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value: string
}

export default Checkbox
export type { Props as CheckboxProps }
