import { Virtualizer } from '@tanstack/react-virtual'
import * as R from 'ramda'
import { UseComboboxReturnValue } from 'downshift'
import { Item } from '../shared/data'
import classNames from 'classnames'
import HighlightKeywords from '../../misc/HighlightKeywords'
import Icon from '../../common/Icon'
import { DropdownItem } from '../shared/commons'

const ROOT_CLASS = 'autocomplete__dropdown'

const defineIconColor = <T,>(selectedItems: T[], item: T) => {
    return selectedItems.includes(item) ? 'black' : 'rgba(28,43,52,0.1)'
}

export const renderDropdown = ({
    isLoading,
    rowVirtualizer,
    items,
    comboBox,
    inputValue,
    selectedItems,
    displayProperties,
}: Props) => {
    if (isLoading)
        return (
            <div className={classNames(ROOT_CLASS + '-empty')}>Loading...</div>
        )
    if (items.length === 0)
        return (
            <div className={classNames(ROOT_CLASS + '-empty')}>
                No results found
            </div>
        )

    const dValue = displayProperties ? displayProperties.id : 'value'
    const dType = displayProperties ? displayProperties.kind : 'type'

    const render = (isHightlighted: boolean, item: any) => {
        const itemValue = String(item[dValue])
        const itemType = String(item[dType])
        if (item.type === 'created') {
            return (
                <div
                    data-keyword
                    title={itemValue}
                    className="autocomplete__ellipsis"
                >
                    <span style={{ marginRight: '5px' }}>{itemValue}</span>
                    <span data-description>add keyword</span>
                </div>
            )
        }
        if (isHightlighted) {
            return (
                <>
                    <div
                        data-keyword
                        title={itemValue}
                        className={'autocomplete__ellipsis'}
                    >
                        <span>{String(item[dValue])}</span>
                    </div>
                    <span data-description>{itemType}</span>
                    <Icon
                        name="check"
                        size="sm"
                        color={defineIconColor(selectedItems, item)}
                        fill={defineIconColor(selectedItems, item)}
                    />
                </>
            )
        }
        return (
            <>
                <div
                    data-keyword
                    title={itemValue}
                    className={'autocomplete__ellipsis'}
                >
                    <HighlightKeywords
                        textToHighlight={itemValue}
                        searchWords={inputValue}
                    />
                </div>
                <span data-description>{itemType}</span>
                <Icon
                    name="check"
                    size="sm"
                    color={defineIconColor(selectedItems, item)}
                    fill={defineIconColor(selectedItems, item)}
                />
            </>
        )
    }

    return (
        <div
            className={classNames(ROOT_CLASS + '_list')}
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = items[virtualRow.index]
                const isHighlighted =
                    comboBox.highlightedIndex === virtualRow.index

                return (
                    <li
                        {...comboBox.getItemProps({
                            index: virtualRow.index,
                            item: items[virtualRow.index],
                        })}
                        className={classNames(ROOT_CLASS + '_list-item', {
                            '--focused': isHighlighted,
                        })}
                        style={{
                            transform: `translateY(${virtualRow.start}px)`,
                            height: `${virtualRow.size}px`,
                            textOverflow: 'ellipsis',
                        }}
                        key={virtualRow.key}
                    >
                        {render(isHighlighted, item)}
                    </li>
                )
            })}
        </div>
    )
}
interface Props {
    isLoading: boolean
    rowVirtualizer: Virtualizer<any, Element>
    comboBox: UseComboboxReturnValue<Item>
    items: any[]
    selectedItems: any[]
    inputValue: string
    displayProperties?: {
        kind: string
        id: string
    }
}

export function renderFakePanel({
    items,
    highlightIndex,
    onMouseOver,
    onClick,
    displayProps,
    hasDesc,
    isActivated,
}: FakePanelProps) {
    if (!items) return

    return items.map((item, idx) => {
        const label = R.prop(displayProps.label, item)
        const amount = R.prop(displayProps.amount, item)
        return (
            <DropdownItem
                key={idx}
                isHighlighted={idx === highlightIndex}
                onMouseOver={() => onMouseOver(idx)}
                onClick={() => onClick(idx)}
                hasCheckIcon={false}
                hasDetail={false}
                isActivated={isActivated}
            >
                <span>{label}</span>
                {hasDesc && <span style={{ color: 'gray' }}>{amount}</span>}
            </DropdownItem>
        )
    })
}

export interface FakePanelProps {
    items: any[]
    highlightIndex: number
    onMouseOver: (idx: number) => void
    onClick: (idx: number) => void
    displayProps: {
        label: string
        amount: string
    }
    hasCheckIcon?: boolean
    hasDetail?: boolean
    hasDesc?: boolean
    isActivated: boolean
}
