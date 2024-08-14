/**
 *
 * Group
 *
 */

import React from 'react'
import cn from 'classnames'
import { SizeContext, useSizeContext } from '../../../context'
import './group.scss'

const BLOCK = 'form_group'
function Group({
    children,
    size = 'md',
    isFullWidth = false,
    className,
    direction = 'horizontal',
    shouldOverrideContext,
    as = 'div',
    ...rest
}: Props) {
    const Component = as
    console.log('as', as)
    // extraClass 와 restProps를 제끼는 부분이 있는데 생략
    const contextSize = useSizeContext().size
    const contextAvailable = Boolean(contextSize)
    const sizeValue =
        (shouldOverrideContext && size) || contextAvailable || size
    const contextValue = React.useMemo(() => ({ size: sizeValue }), [sizeValue])

    return (
        <Component
            role="group"
            className={cn(
                BLOCK,
                `${BLOCK}--${direction}`,
                // `${BLOCK}--${sizeValue}`
                {
                    [`${BLOCK}--is-full-width`]: isFullWidth,
                    [`${BLOCK}--is-nested`]: contextAvailable,
                },
                className
            )}
        >
            <SizeContext.Provider value={contextValue}>
                {children}
            </SizeContext.Provider>
        </Component>
    )
}

export function GroupContextReset({ children }: { children: React.ReactNode }) {
    return <SizeContext.Provider value={{}}>{children}</SizeContext.Provider>
}

interface Props extends React.HTMLAttributes<HTMLElement> {
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    as?: keyof JSX.IntrinsicElements
    className?: string
    direction?: 'vertical' | 'horizontal'
    isFullWidth?: boolean
    shouldOverrideContext?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

export default Group
