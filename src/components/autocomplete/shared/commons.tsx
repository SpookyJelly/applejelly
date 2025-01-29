import React, { useRef } from 'react'
import styled from '@emotion/styled'
import Icon from '../../common/Icon'
import Button from '../../form/Button'
import { Item } from './data'
import { UseMultipleSelectionReturnValue } from 'downshift'
import Tooltip from '../../dialogs/Tooltip'
import Overflower from '../../../components/layout/Overflower'
import OverflowList from '../../../components/layout/OverflowList'
import { ZINDEX } from './constant'
import cn from 'classnames'
import './shared.scss'

interface ChipProps extends React.HTMLAttributes<HTMLElement> {
    removeHandler: React.MouseEventHandler
    content: string
    kind: 'dark' | 'light'
}

const TOOLTIP_INNER_COLOR = 'rgba(255,255,255,0.68)'
const BLOCK = 'autocomplete-shared'

interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {}
export const Menu = ({ children, className, ...rest }: MenuProps) => {
    return (
        <ul className={cn(BLOCK + '__menu', className)} {...rest}>
            {children}
        </ul>
    )
}
interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    activated?: boolean
    size?: 'sm' | 'md' | 'lg'
}
export const Panel = ({
    activated,
    size,
    children,
    className,
    ...rest
}: PanelProps) => {
    return (
        <div
            className={cn(
                BLOCK + '__panel',
                {
                    '--activated': activated,
                    '--sm': size === 'sm',
                    '--md': size === 'md',
                    '--lg': size === 'lg',
                },
                className
            )}
            {...rest}
        >
            {children}
        </div>
    )
}

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
    kind?: 'dark' | 'light'
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
    ({ kind = 'light', className, ...rest }, ref) => {
        return (
            <div
                {...rest}
                ref={ref}
                className={cn(BLOCK + '__tag', {
                    '--light': kind === 'light',
                    '--dark': kind === 'dark',
                })}
            />
        )
    }
)

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
    ({ removeHandler, content, kind, ...props }, ref) => {
        return (
            <Tag
                kind={kind}
                ref={ref}
                {...props}
                style={{ display: 'flex', marginRight: 3 }}
            >
                <span
                    style={{
                        maxWidth: '100px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {content}
                </span>
                <span className="cancel-icon" onClick={removeHandler}>
                    &#10005;
                </span>
            </Tag>
        )
    }
)

interface ItemContentProps extends React.HTMLAttributes<HTMLLIElement> {
    isHighlighted: boolean
    isIncluded?: boolean
    hasCheckIcon?: boolean
    hasDetail?: boolean
    isActivated: boolean
}

const ItemContent = ({
    className,
    children,
    isHighlighted,
    isIncluded,
    isActivated,
    ...rest
}: ItemContentProps) => {
    return (
        <li
            className={cn(BLOCK + '__item-content', className, {
                '--highlighted': isHighlighted,
                '--included': isIncluded,
                '--activated': isActivated,
                '--both': isHighlighted && isActivated,
            })}
            {...rest}
        >
            {children}
        </li>
    )
}

interface GuideProps extends React.HTMLAttributes<HTMLDivElement> {}

const Guide = ({ children, className, ...rest }: GuideProps) => {
    return (
        <div className={cn(BLOCK + '__guide', className)} {...rest}>
            {children}
        </div>
    )
}

// render functions
export const renderGuide = ({
    content,
    style,
}: {
    content?: React.ReactNode
    style?: React.CSSProperties
} = {}) => {
    const defaultContent = (
        <span>
            <span>
                Use
                <kbd data-kind="icon">
                    <Icon name="arrowUp" size="xxs" />
                </kbd>
                <kbd data-kind="icon">
                    <Icon name="arrowDown" size="xxs" />
                </kbd>
                to navigate <kbd data-kind="text">Enter</kbd> to update query
            </span>
        </span>
    )
    const displayContent = content ?? defaultContent
    return <Guide style={style}>{displayContent}</Guide>
}

export const renderClearButton = (
    props?: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
    return (
        <Button
            className="autocomplete-clear-button"
            icon="cancelCircled"
            isBorderless
            size="lg"
            isDangerouslyNaked
            {...props}
        />
    )
}

//NOTE: removed ToggleButton actions on Chips
export const renderSelectedItems = (
    isSingle: boolean,
    selectedItems: Item[],
    multipleSelection: UseMultipleSelectionReturnValue<Item>,
    overflowerType: 'ellipsis' | 'gradient'
) => {
    if (isSingle) {
        return selectedItems.map((item, index) => (
            <Tooltip
                isEnabled
                style={{ overflow: 'hidden' }}
                content={item.value}
                key={index}
            >
                <div>
                    <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {item.value}
                    </p>
                </div>
            </Tooltip>
        ))
    }

    let child = selectedItems.map((selectedItem, index) => (
        <Chip
            className="selected-item-tooltip"
            key={`selected-item-${index}`}
            kind="light"
            removeHandler={(e) => {
                e.stopPropagation()
                multipleSelection.removeSelectedItem(selectedItem)
            }}
            content={selectedItem.value}
            {...multipleSelection.getSelectedItemProps({
                selectedItem,
                index,
                tabIndex: undefined,
            })}
        />
    ))

    // Get the width of the first element in "child"
    if (overflowerType === 'ellipsis') {
        return (
            <Tooltip
                style={{
                    flex: selectedItems.length > 1 ? '10' : '0',
                    maxWidth: 'auto',
                }}
                isEnabled={selectedItems.length > 0}
                contents={
                    <div style={{ display: 'flex', gap: '3px', width: '100%' }}>
                        {selectedItems.map((selectedItem, index) => (
                            <Chip
                                className="selected-item-tooltip"
                                key={`selected-item-${index}`}
                                kind="dark"
                                removeHandler={(e) => {
                                    e.stopPropagation()
                                    multipleSelection.removeSelectedItem(
                                        selectedItem
                                    )
                                }}
                                content={selectedItem.value}
                                {...multipleSelection.getSelectedItemProps({
                                    selectedItem,
                                    index,
                                    tabIndex: undefined,
                                })}
                            />
                        ))}
                    </div>
                }
            >
                <OverflowList
                    initialShowCount={2}
                    style={{
                        width: 'auto',
                        flex: selectedItems.length > 1 ? '10' : '0',
                    }}
                    alignItems="center"
                >
                    {child}
                </OverflowList>
            </Tooltip>
        )
    }
    if (overflowerType === 'gradient') {
        return (
            <Overflower
                tooltipContent={selectedItems.map((selectedItems, index) => (
                    <Chip
                        className="selected-item-tooltip"
                        key={`selected-item-${index}`}
                        kind="dark"
                        removeHandler={(e) => {
                            e.stopPropagation()
                            multipleSelection.removeSelectedItem(selectedItems)
                        }}
                        content={selectedItems.value}
                        {...multipleSelection.getSelectedItemProps({
                            selectedItem: selectedItems,
                            index,
                            tabIndex: undefined,
                        })}
                    />
                ))}
                type="gradient"
                tooltipProps={{
                    placement: 'top',
                    maxWidth: 'auto',
                }}
                style={{
                    flex: selectedItems.length > 0 ? 8 : 0,
                    lineHeight: 'normal',
                }}
            >
                {selectedItems.map((selectedItem, index) => (
                    <Chip
                        className="selected-item-tooltip"
                        key={`selected-item-${index}`}
                        kind="light"
                        removeHandler={(e) => {
                            e.stopPropagation()
                            multipleSelection.removeSelectedItem(selectedItem)
                        }}
                        content={selectedItem.value}
                        {...multipleSelection.getSelectedItemProps({
                            selectedItem,
                            index,
                            tabIndex: undefined,
                        })}
                    />
                ))}
            </Overflower>
        )
    }
}

interface DropdownProps extends React.HTMLAttributes<HTMLLIElement> {
    isHighlighted: boolean
    isIncluded?: boolean
    hasCheckIcon?: boolean
    hasDetail?: boolean // 상세 정보가 있는지 여부
    isActivated: boolean
}

export const DropdownItem = React.forwardRef(
    (props: DropdownProps, ref: React.Ref<HTMLLIElement>) => {
        return (
            <ItemContent {...props}>
                {props.children}
                <div>
                    {props.hasCheckIcon && (
                        <span className="iconWrapper">
                            <Icon
                                name="check"
                                size="sm"
                                color={
                                    props.isIncluded
                                        ? 'black'
                                        : 'rgba(28, 43, 52, 0.1)'
                                }
                            />
                        </span>
                    )}
                    {props.hasDetail && (
                        <>
                            <Icon
                                name="angleRight"
                                hasInlineCentering
                                size="sm"
                                color={
                                    props.isHighlighted && props.isActivated
                                        ? 'white'
                                        : 'black'
                                }
                            />
                        </>
                    )}
                </div>
            </ItemContent>
        )
    }
)

interface AutoCompleteTooltipProps extends React.HTMLAttributes<HTMLElement> {
    validationMessage?: string
    items: React.ReactNode[]
    isEnabled?: boolean
}

export const AutoCompleteTooltip = React.forwardRef(
    (
        {
            validationMessage,
            items,
            isEnabled = true,
            ...rest
        }: AutoCompleteTooltipProps,
        ref: React.Ref<HTMLElement>
    ) => {
        const content = Boolean(validationMessage) ? validationMessage : items

        // const ContentWrapper = styled.div`
        //     ${tw`flex [gap: 3px] text-[rgba(255,255,255,0.68)]`}
        // `
        // const IconWrapper = styled.div`
        //     ${tw`z-10 top-[-10px] absolute right-[-5px] bg-white [height: 13px] [width: 16px] [border-radius: 50px]`}
        // `

        return (
            <Tooltip
                style={{ width: '100%', maxWidth: 'auto' }}
                contents={
                    <div
                        style={{
                            display: 'flex',
                            gap: '3px',
                            color: 'rgba(255, 255, 255, 0.68)',
                        }}
                    >
                        {content}
                    </div>
                }
                // isOpen={Boolean(validationMessage)}
                isOpen={true}
                isEnabled={isEnabled}
                // ref={ref}
            >
                <div style={{ position: 'relative', zIndex: ZINDEX.LV3 }}>
                    {validationMessage && (
                        <div
                            style={{
                                zIndex: ZINDEX.LV3,
                                top: '-10px',
                                position: 'absolute',
                                right: '-5px',
                                backgroundColor: 'white',
                                height: '13px',
                                width: '16px',
                                borderRadius: '50px',
                            }}
                        >
                            <Icon
                                name="attentionCircled"
                                size="sm"
                                color="red"
                            />
                        </div>
                    )}
                </div>
                {rest.children}
            </Tooltip>
        )
    }
)

interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
    isMultiline: boolean
    validationMessage?: string
    isReadOnly?: boolean
}

export const InputWrapper = ({
    className,
    children,
    isOpen,
    isMultiline,
    validationMessage,
    isReadOnly,
    ...rest
}: InputWrapperProps) => {
    return (
        <div
            className={cn(BLOCK + '__input-wrapper', className, {
                '--readonly': isReadOnly,
                '--isOpen': isOpen,
                '--validMessage': validationMessage,
            })}
            {...rest}
        >
            {children}
        </div>
    )
}
interface LayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    isSingle: boolean
    overflowerType: 'ellipsis' | 'gradient'
}

export const LayoutContainer = ({
    className,
    children,
    isSingle,
    overflowerType,
    ...rest
}: LayoutContainerProps) => {
    return (
        <div
            className={cn(
                BLOCK + '__layout-container',
                {
                    '--nowrap': isSingle || overflowerType === 'gradient',
                },
                className
            )}
            {...rest}
        >
            {children}
        </div>
    )
}
