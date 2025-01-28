/** * *
Overflower
* */
import React from 'react'
import * as R from 'ramda'
import cn from 'classnames'
import { isString, isArray } from 'lodash'
import Tooltip from '../../dialogs/Tooltip'
import Text from '../../typography/Text'
import {
    SPACING_VALUES,
    TSHIRT_SIZE,
    SPACING_SIZE,
} from '@applejelly/style/constant'
import {
    useAsComponent,
    getContextSizeOrSize,
    getSpaceValue,
} from '../../../utils'
import {
    MarginProps,
    getBasePropsClassnames,
    omitBaseProps,
} from '../../../helpers'
import './overflower.scss'

const BLOCK = 'layout_overflower'
function Overflower(props: Props) {
    const {
        as: propAs,
        size,
        children,
        type,
        position,
        shorterContent,
        tooltipContent,
        beforeContent,
        afterContent,
        outerBeforeContent,
        outerAfterContent,
        hasExtraContentInTooltip,
        hasTooltip,
        verticalAlign,
        isInline,
        hasInlineContext,
        isNested,
        className,
        tooltipProps,
        height,
        padding,
        paddingX = padding,
        paddingY = padding,
        maxWidth,
        tooltip,
        isEnabled,
        contentId,
        style,
        ...rest
    } = props

    const tooltipContentValue = tooltipContent || children
    const tooltipContentString =
        isString(tooltipContentValue) &&
        (!beforeContent || isString(beforeContent)) &&
        (!afterContent || isString(afterContent))
            ? `${beforeContent || ''}${tooltipContentValue}${afterContent || ''}`
            : undefined
    const isTooltipContentArray = isArray(tooltipContentValue)
    const tooltipContentElement = (
        <div
            className={cn(`${BLOCK}__tooltipContent`, {
                [`${BLOCK}__tooltipContent--is-array`]: isTooltipContentArray,
            })}
        >
            {hasExtraContentInTooltip && beforeContent}
            {isTooltipContentArray
                ? tooltipContentValue.map((content, index) => {
                      return typeof content === 'string' ? (
                          <span key={index}>{content}</span>
                      ) : (
                          content
                      )
                  })
                : tooltipContentValue}
            {hasExtraContentInTooltip && afterContent}
        </div>
    )

    const hasTooltipOverflow =
        !isNested &&
        !hasInlineContext &&
        hasTooltip &&
        tooltipContentValue !== ''
    const hasTooltipTitle =
        !isNested &&
        hasTooltip &&
        !hasTooltipOverflow &&
        tooltipContentString !== ''
    const Element = hasInlineContext || propAs === 'span' ? 'span' : 'div'
    const finalPropAs = React.useMemo(
        () => propAs || (tooltip ? <Text as={Tooltip} /> : Text),
        [propAs, tooltip]
    )
    const hasTooltipContent = !propAs && tooltip

    const [Comp, compProps] = useAsComponent(finalPropAs)

    // const Wrapper = isNested ? Element : Comp
    const Wrapper = Comp
    const contextSize = getContextSizeOrSize('md')
    const sizeValue = compProps.size || size || contextSize

    const hasBeforeOrAfterContent =
        beforeContent || afterContent || shorterContent !== undefined

    const beforeContentElement = beforeContent && (
        <Element className={`${BLOCK}__before`}>{beforeContent}</Element>
    )
    const afterContentElement = afterContent && (
        <Element className={`${BLOCK}__after`}>{afterContent}</Element>
    )
    const outerBeforeContentElement = outerBeforeContent && (
        <Element className={`${BLOCK}__before`}>{outerBeforeContent}</Element>
    )
    const outerAfterContentElement = outerAfterContent && (
        <Element className={`${BLOCK}__after`}>{outerAfterContent}</Element>
    )

    const isShorterContentEmpty = shorterContent === ''
    const overflower = (
        <>
            {beforeContentElement}
            {!isShorterContentEmpty && (
                <Element className={`${BLOCK}__overflow-inner`}>
                    {hasBeforeOrAfterContent ? (
                        <Overflower
                            isNested={true}
                            type={type}
                            position={position}
                        >
                            {shorterContent !== undefined
                                ? shorterContent
                                : children}
                        </Overflower>
                    ) : (
                        children
                    )}
                </Element>
            )}
            {afterContentElement}
        </>
    )

    const calcHeight =
        typeof height === 'number' && paddingY
            ? height + SPACING_VALUES[paddingY]
            : height
    const isNotAutoHeight = Boolean(calcHeight && calcHeight !== 'auto')

    const renderContent = () => (
        <>
            {outerBeforeContentElement}
            <Element id={contentId} className={`${BLOCK}__content`}>
                {overflower && (
                    <Element
                        className={cn(`${BLOCK}__overflow`, {
                            [`${BLOCK}__overflow--type-${type}`]:
                                !hasBeforeOrAfterContent,
                            [`${BLOCK}__overflow--position-${position}`]:
                                !hasBeforeOrAfterContent,
                        })}
                        aria-hidden={!isNested || undefined}
                        title={
                            hasTooltipTitle ? tooltipContentString : undefined
                        }
                    >
                        {hasTooltipOverflow ? (
                            <Tooltip
                                display="inline-flex"
                                className={`${BLOCK}__overflow-content`}
                                content={tooltipContentElement}
                                style={{
                                    width: '100%',
                                }}
                                {...tooltipProps}
                            >
                                {overflower}
                            </Tooltip>
                        ) : (
                            <Element className={`${BLOCK}__overflow-content`}>
                                {overflower}
                            </Element>
                        )}
                    </Element>
                )}
                <Element className={`${BLOCK}__original`}>
                    {beforeContentElement}
                    {children}
                    {afterContentElement}
                </Element>
            </Element>
            {outerAfterContentElement}
        </>
    )

    const wrapperStyle =
        !isNested &&
        (isNotAutoHeight ||
            paddingX ||
            paddingY ||
            maxWidth ||
            verticalAlign !== 'baseline')
            ? {
                  '--overflower-padding-x': getSpaceValue(paddingX),
                  '--overflower-padding-y': getSpaceValue(paddingY),
                  '--overflower-line-height': calcHeight
                      ? typeof calcHeight === 'number'
                          ? `${calcHeight - 1}px`
                          : `calc(${calcHeight}) - 1px)`
                      : undefined,
                  '--overflower-height': isNotAutoHeight
                      ? typeof calcHeight === 'number'
                          ? `${calcHeight}px`
                          : calcHeight
                      : undefined,
                  '--overflower-max-width':
                      typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
                  '--overflower-vertical-align':
                      verticalAlign !== 'baseline'
                          ? verticalAlign === 'top'
                              ? 'flex-start'
                              : 'flex-end'
                          : undefined,
              }
            : {}

    const getFilteredStyle = React.useCallback(() => {
        if (wrapperStyle) {
            return R.keys(wrapperStyle).reduce((acc, styleKey) => {
                const value = wrapperStyle[styleKey]
                if (value !== undefined) {
                    acc[styleKey] = value
                }
                return acc
            }, {})
        }
        return {}
    }, [wrapperStyle])

    const filteredStyle = getFilteredStyle()

    const wrapperProps = {
        ...(hasTooltipContent
            ? {
                  ...tooltipProps,
                  content: tooltip,
                  shouldMergeNestedTooltips: true,
                  display: isInline ? 'inline-flex' : 'flex',
              }
            : {}),
        size: isNested ? undefined : sizeValue,
        className: cn(
            BLOCK,
            `${BLOCK}--size-${sizeValue}`,
            {
                [`${BLOCK}--is-inline`]: isInline,
                [`${BLOCK}--has-auto-height`]: calcHeight === 'auto',
                [`${BLOCK}--is-disabled`]: !isEnabled,
            },
            className
        ),
        style: {
            ...filteredStyle,
            ...style,
        },
        ...rest,
    }

    return (
        <Wrapper {...wrapperProps}>
            {isEnabled ? (
                renderContent()
            ) : (
                <>
                    {outerBeforeContentElement}
                    {beforeContentElement}
                    {children}
                    {afterContentElement}
                    {outerAfterContentElement}
                </>
            )}
        </Wrapper>
    )
}

Overflower.defaultProps = {
    hasExtraContentInTooltip: false,
    hasInlineContext: false,
    hasTooltip: true,
    isEnabled: true,
    isInline: false,
    isNested: false,
    position: 'end',
    type: 'ellipsis',
    verticalAlign: 'baseline',
    style: {},
}

interface Props extends OverflowerProps, MarginProps {}

export interface OverflowerProps {
    afterContent?: React.ReactNode
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    beforeContent?: React.ReactNode | string
    className?: string
    contentId?: string
    hasExtraContentInTooltip?: boolean
    hasInlineContext?: boolean
    hasTooltip?: boolean
    height?: string | number
    isEnabled?: boolean
    isInline?: boolean
    isNested?: boolean
    maxWidth?: string | number
    outerAfterContent?: React.ReactNode
    outerBeforeContent?: React.ReactNode
    padding?: SPACING_SIZE | undefined
    paddingX?: SPACING_SIZE | undefined
    paddingY?: SPACING_SIZE | undefined
    position?: 'start' | 'end'
    shorterContent?: React.ReactNode
    tooltip?: React.ReactNode
    tooltipContent?: React.ReactNode | React.ReactNode[]
    tooltipProps?: any
    type?: 'gradient' | 'ellipsis'
    verticalAlign?: 'baseline' | 'top' | 'bottom'
    children?: React.ReactNode | React.ReactNode[]
    size?: TSHIRT_SIZE
    style?: React.CSSProperties
}

export default Overflower
