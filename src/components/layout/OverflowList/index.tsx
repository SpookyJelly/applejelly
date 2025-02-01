/**
 *
 * OverflowList
 *
 */

import React from 'react'
import * as R from 'ramda'
import classNames from 'classnames'
import Case from 'case'
import isEqual from 'react-fast-compare'
import Text from '../../typography/Text'
import {
    useConditionalRefUpdate,
    useMount,
    getSpaceValue,
    useAsComponent,
} from '../../../utils'
import type { SPACING_SIZE, Justify, AlignItem } from '../../../types'
import useDynamicChildrenVisibility from './useDynamicChildrenVisibility'
import './overflow-list.scss'

const BLOCK = 'AJ-layout_overflow-list'
export const LAST_VISIBLE_ITEM = 'lastVisibleItem'
export const DATA_LAST_VISIBLE_ITEM = `data-${Case.kebab(LAST_VISIBLE_ITEM)}`
const EMPTY_ITEMS = []
const DefaultHandle = ({ count, hasAllHidden, beforeContent }) => (
    <Text>
        {hasAllHidden ? (
            <React.Fragment>
                {beforeContent} {count}
            </React.Fragment>
        ) : (
            `+${count}`
        )}
    </Text>
)

const adjustHiddenCount = function ({
    hiddenCount,
    maxCount,
    size,
    isSimpleVerticalMode,
    lines,
}) {
    // If maxCount is zero, return the total number of items as all are considered hidden
    if (maxCount === 0) {
        return size
    }

    // In simple vertical mode, calculate the hidden items based on total size and visible lines
    if (isSimpleVerticalMode) {
        return size > lines ? size - lines + 1 : 0
    }

    // In other cases, return the original hiddenCount
    return hiddenCount
}

function OverflowList(props: Props) {
    const {
        maxCount,
        isEnabled,
        isVertical,
        lines = isVertical ? 'auto' : 1,
        lineHeight,
        handleComponent: Handle = DefaultHandle,
        handleClassName,
        handleData,
        minItemWidth,
        shouldAlwaysRenderHandle,
        hasVisibleSpy,
        visibilityOffset,
        getHandleWidth,
        hasContainment,
        children = [],
        className,
        style,
        gapX,
        gapY,
        justify,
        alignItems,
        onHiddenCountChange,
        beforeContent,
        afterContent,
        initialShowCount,
        as,
        contentClassName,
        ...rest
    } = props

    const initialCount =
        isEnabled && !isVertical
            ? Math.min(maxCount != null ? maxCount : Infinity, children.length)
            : undefined
    const isSimpleVerticalMode = isVertical && typeof lines == 'number'

    const {
        hiddenCount,
        ref: containerRef,
        handleRef,
        beforeRef,
        afterRef,
    } = useDynamicChildrenVisibility({
        visibilityOffset: visibilityOffset,
        hasVisibleSpy: hasVisibleSpy,
        children: children,
        maxCount: maxCount,
        isEnabled:
            isEnabled &&
            children.length > 1 &&
            !isSimpleVerticalMode &&
            0 !== maxCount,
        getHandleWidth: getHandleWidth,
        shouldAlwaysRenderHandle: shouldAlwaysRenderHandle,
        initialShownCount: initialCount,
    })

    const hiddenItemCount = adjustHiddenCount({
        hiddenCount: hiddenCount,
        maxCount: maxCount,
        size: children.length,
        lines: lines,
        isSimpleVerticalMode: isSimpleVerticalMode,
    })
    const realHiddenCount = useMount().current ? hiddenItemCount : undefined

    React.useEffect(
        function () {
            if (realHiddenCount !== undefined) {
                onHiddenCountChange?.(realHiddenCount)
            }
        },
        [realHiddenCount, onHiddenCountChange]
    )

    const visibleItems = [
        ...(isSimpleVerticalMode
            ? children.slice(0, children.length - hiddenItemCount)
            : maxCount !== undefined
              ? children.slice(0, maxCount)
              : children),
    ]

    const isAllHidden = hiddenItemCount === children.length
    const containerCurrent = useConditionalRefUpdate(containerRef)
    const beforeCurrent = useConditionalRefUpdate(beforeRef)

    const actualLineHeight = React.useMemo(
        function () {
            if (lineHeight)
                return 'number' == typeof lineHeight
                    ? `${lineHeight}px`
                    : lineHeight
            if (containerCurrent) {
                const firstChild =
                    containerCurrent.children[0] === beforeCurrent
                        ? containerCurrent.children[1]
                        : containerCurrent.children[0]
                const childHeight =
                    null == firstChild ? undefined : firstChild.offsetHeight
                if (childHeight) return `${childHeight}px`
            }
        },
        [lineHeight, containerCurrent, beforeCurrent]
    )

    const hiddenItems = React.useMemo(
        function () {
            return hiddenItemCount
                ? children.slice(children.length - hiddenItemCount)
                : []
        },
        [children, hiddenItemCount]
    )

    const hiddenItemLength = hiddenItemCount
        ? hiddenItemCount.toString().length
        : 0
    const handleWidth =
        initialCount && getHandleWidth
            ? getHandleWidth(hiddenItemLength)
            : undefined

    const contentStyle = {
        '--lines':
            (isEnabled || hasContainment) &&
            'number' == typeof lines &&
            1 !== lines
                ? lines
                : undefined,
        '--line-height': actualLineHeight,
        '--gap-x': getSpaceValue(gapX),
        '--gap-y': getSpaceValue(gapY),
        '--justify-content': justify,
        '--align-items': alignItems,
        '--min-item-width': minItemWidth,
        '--handle-width': handleWidth,
    }
    const beforeElement =
        typeof beforeContent == 'function'
            ? beforeContent(hiddenItemCount)
            : beforeContent
    const afterElement =
        typeof afterContent == 'function'
            ? afterContent(hiddenItemCount)
            : afterContent

    const handleComp = Handle ? (
        <div
            className={classNames(`${BLOCK}__handle`, handleClassName)}
            ref={handleRef}
        >
            {hiddenItemCount || shouldAlwaysRenderHandle ? (
                <Handle
                    count={hiddenItemCount}
                    items={children}
                    hiddenItems={hiddenItems}
                    beforeContent={beforeElement}
                    afterContent={afterElement}
                    hasAllHidden={isAllHidden}
                    data={handleData}
                />
            ) : null}
        </div>
    ) : null

    if (initialCount && handleComp) {
        visibleItems.splice(initialCount, 0, handleComp)
        const lastVisibleItemIndex = Math.max(
            0,
            initialCount - 1 - hiddenItemCount
        )
        const modifiedLastVisibleItem = React.cloneElement(
            //@ts-ignore
            visibleItems[lastVisibleItemIndex],
            { [DATA_LAST_VISIBLE_ITEM]: true }
        )
        visibleItems.splice(lastVisibleItemIndex, 1, modifiedLastVisibleItem)
    }

    const [Comp] = useAsComponent(as || 'div')

    return (
        <Comp
            {...rest}
            className={classNames(
                BLOCK,
                {
                    [`${BLOCK}--is-disabled`]:
                        !isEnabled || isSimpleVerticalMode,
                    [`${BLOCK}--is-single-line`]: 1 === lines,
                    [`${BLOCK}--is-vertical`]: isVertical,
                    [`${BLOCK}--has-auto-height`]:
                        !isEnabled || 'auto' === lines,
                    [`${BLOCK}--has-containment`]:
                        isEnabled && hasContainment && !isVertical,
                    [`${BLOCK}--has-all-hidden`]: isAllHidden,
                    [`${BLOCK}--has-always-all-hidden`]: 0 === maxCount,
                },
                className
            )}
            style={style}
        >
            <div
                className={classNames(`${BLOCK}-content`, contentClassName)}
                style={contentStyle as any}
                ref={containerRef}
            >
                {beforeElement ? (
                    <div
                        className={classNames(`${BLOCK}__before`)}
                        ref={beforeRef}
                    >
                        {beforeElement}
                    </div>
                ) : null}
                {visibleItems.map((item, index) => (
                    <React.Fragment key={index}>{item}</React.Fragment>
                ))}
                {initialCount ? null : handleComp}
                {afterElement ? (
                    <div
                        className={classNames(`${BLOCK}__after`)}
                        ref={afterRef}
                    >
                        {afterElement}
                    </div>
                ) : null}
            </div>
        </Comp>
    )
}

OverflowList.defaultProps = {
    isEnabled: true,
    handleData: true,
    hasVisibleSpy: true,
    visibilityOffset: 100,
    isVertical: false,
    gapX: 'xs',
    gapY: 'xs',
    children: [],
    as: 'div',
}

interface Props {
    maxCount?: number
    isEnabled?: boolean
    isVertical?: boolean
    lines?: number | 'auto'
    lineHeight?: string | number
    handleComponent?: any
    handleClassName?: string
    handleData?: unknown
    minItemWidth?: string
    shouldAlwaysRenderHandle?: boolean
    hasVisibleSpy?: boolean
    visibilityOffset?: number
    getHandleWidth?: (digits: number) => string
    hasContainment?: boolean
    children?: React.ReactNode[]
    className?: string
    style?: React.CSSProperties
    gapX?: SPACING_SIZE
    gapY?: SPACING_SIZE
    justify?: Justify
    alignItems?: AlignItem
    onHiddenCountChange?: (count: number) => void
    beforeContent?: React.ReactNode | ((hiddenCount: number) => React.ReactNode)
    afterContent?: React.ReactNode | ((hiddenCount: number) => React.ReactNode)
    initialShowCount?: number
    as?: any
    contentClassName?: string
}

export default OverflowList
