/**
 *
 * KeyboardShortcut
 *
 */

import React from 'react'
import classNames from 'classnames'
import { getContextSizeOrSize } from '../../../utils'
import './keyboard-shortcut.scss'

import KeyCap from '../KeyCap'
import Spacing from '../../layout/Spacing'
import Text from '../Text'

const rootClass = 'keyboard-shortcut'
const sizeList = ['xs', 'sm', 'md', 'lg']
const keyVariantDic = {
    default: 'default',
    secondary: 'secondary',
    tertiary: 'tertiary',
    knockout: 'knockout',
    'secondary-knockout': 'knockout',
    disabled: 'disabled',
}

function KeyboardShortcut({
    className,
    variant,
    keys,
    size = 'md',
    hasNoCapitalize = false,
}: Props) {
    const contextSize = getContextSizeOrSize('md', sizeList)
    const sizeValue = size || contextSize
    if (!keys) return

    return (
        <span
            className={classNames(rootClass, className)}
            style={{
                whiteSpace: 'nowrap',
            }}
        >
            {keys.map((key, idx, arr) => {
                return (
                    <React.Fragment key={idx}>
                        {Array.isArray(key) ? (
                            key.map((singleKey, index) => {
                                return (
                                    <Spacing>
                                        <KeyCap
                                            variant={variant}
                                            size={sizeValue}
                                            keycap={singleKey}
                                        />
                                    </Spacing>
                                )
                            })
                        ) : (
                            <KeyCap
                                variant={variant}
                                size={sizeValue}
                                hasNoCapitalize={hasNoCapitalize}
                                keycap={key}
                            />
                        )}
                        {idx !== arr.length - 1 && (
                            <Text
                                size={sizeValue}
                                isMonospace
                                //@ts-ignore
                                variant={keyVariantDic[variant]}
                                className={`${rootClass}__separator`}
                            >
                                {'+'}
                            </Text>
                        )}
                    </React.Fragment>
                )
            })}
        </span>
    )
}

KeyboardShortcut.defaultProps = {
    variant: 'default',
    keys: [],
}

interface Props {
    className?: string
    variant:
        | 'default'
        | 'secondary'
        | 'tertiary'
        | 'knockout'
        | 'secondary-knockout'
        | 'disabled'
    keys?: string[]
    size?: 'xs' | 'sm' | 'md' | 'lg'
    hasNoCapitalize?: boolean
}

export default KeyboardShortcut
