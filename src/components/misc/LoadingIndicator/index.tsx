/**
 *
 * LoadingIndicator
 *
 */

import React from 'react'
import cn from 'classnames'
import './loading-indicator.scss'
import { TSHIRT_SIZE } from '@applejelly/style/constant'

// chrome/ android가 아니면서 safari 인 문자열 통과
const isValidBrowser = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent
)

const BLOCK = 'AJ-misc_loading-indicator'
function LoadingIndicator({
    className,
    isAnimated = true,
    isKnockout,
    size,
    ...rest
}: Props) {
    const classes = cn(
        BLOCK,
        {
            [`${BLOCK}--is-knockout`]: isKnockout,
        },
        className
    )
    const animatedClass = { [`${BLOCK}--is-animated`]: isAnimated }
    return (
        <div
            className={classes}
            role="progressbar"
            aria-busy={true}
            aria-valuetext="Loading"
            aria-label="Loading"
        >
            <div
                className={cn(
                    `${BLOCK}__rotating`,
                    `${BLOCK}__rotating--${size}`,
                    !isValidBrowser && animatedClass
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className={`${BLOCK}__svg`}
                >
                    <path
                        className={`${BLOCK}__background`}
                        d="M16,0C7.16,0,0,7.16,0,16s7.16,16,16,16s16-7.16,16-16S24.84,0,16,0z M16,26.5c-5.799,0-10.5-4.701-10.5-10.5S10.201,5.5,16,5.5S26.5,10.201,26.5,16S21.799,26.5,16,26.5z"
                    />
                    <path
                        className={cn(
                            `${BLOCK}__foreground`,
                            isValidBrowser && animatedClass
                        )}
                        d="M16,0v4v1.5c5.799,0,10.5,4.701,10.5,10.5H28h4C32,7.163,24.837,0,16,0z"
                    />
                </svg>
            </div>
        </div>
    )
}

interface Props {
    className?: string
    isAnimated?: boolean
    isKnockout?: boolean
    size?: TSHIRT_SIZE
}

export default LoadingIndicator
export type { Props as LoadingIndicatorProps }
