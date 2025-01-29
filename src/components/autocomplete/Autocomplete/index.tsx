/**
 *
 * AutoComplete
 *
 */

import React, { useState, useMemo } from 'react'
import * as R from 'ramda'
import classNames from 'classnames'
import './autocomplete.scss'
import AutocompleteProps, { PanelActionTypes } from '../shared/types'
import { Item } from '../shared/data'
import {
    FloatingPortal,
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from '@floating-ui/react'
import Button from '../../form/Button'
import { useVirtualizer } from '@tanstack/react-virtual'
import ClickOutside from '../../misc/ClickOutside'
import {
    AutoCompleteTooltip,
    renderClearButton,
    renderGuide,
} from '../shared/commons'
import { getFilteredItems, getInputFilteredItems } from './fn'
import { fakePanelReducer } from './actions'
import {
    inputKeyDownHandler,
    moveToSubTypePanel,
    moveToTypePanel,
} from './handlers'
import { useCombobox, useMultipleSelection } from 'downshift'
import { useSource } from './hooks'
import { renderDropdown, renderFakePanel } from './dropdownEl'

export const ROOT_CLASS = 'autocomplete'

function AutoComplete({
    data,
    creatable,
    defaultValue,
    value,
    onClickClear,
    ...rest
}: Props) {
    const init = () => {
        if (!defaultValue && !value) return []
        if (value) return Array.isArray(value) ? value : [value]
        if (defaultValue) return [defaultValue]
        return []
    }

    const [inputValue, setInputValue] = useState('')
    const [selectedItems, setSelectedItems] = useState<Item[]>(
        value ? [value] : []
    )
    const [fpState, dispatch] = React.useReducer(fakePanelReducer, {
        type: { index: -1, selectedItem: {} },
        subType: { index: -1, selectedItem: {} },
        activatedPanel: 'type',
    })
    let items: Item[] = useMemo(() => {
        if (fpState.activatedPanel === 'subType') {
            const newData = data.filter(
                (item) => item.type === fpState.type.selectedItem.type
            )
            return getInputFilteredItems(newData, inputValue)
        }
        return getFilteredItems(data, inputValue, Boolean(creatable), fpState)
    }, [inputValue, creatable, data, fpState])

    const [panelMode, setPanelMode] = useState<'category' | 'list'>('category')

    const hasClearButton = useMemo(() => {
        const limit = 1
        const renderCondition = rest.hasClearButton
        return renderCondition && selectedItems.length >= limit
    }, [rest.hasClearButton, selectedItems])

    const hasCaretDownIcon = useMemo(() => {
        const renderCondition = rest.hasCaretDownIcon
        return renderCondition
    }, [hasClearButton, rest.hasCaretDownIcon])

    const Component = 'div'
    const parentRef = React.useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => 30,
    })

    const comboBox = useCombobox({
        items,
        defaultHighlightedIndex: undefined,
        selectedItem: null,
        onIsOpenChange(changes) {
            rowVirtualizer.scrollToIndex(0)
        },
        onHighlightedIndexChange({ highlightedIndex, type }) {
            if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
                rowVirtualizer.scrollToIndex(highlightedIndex!)
            }
        },
        inputValue,
        stateReducer(state, actionAndChanges) {
            const { changes, type } = actionAndChanges
            switch (type) {
                case useCombobox.stateChangeTypes.InputBlur:
                    return state
                case useCombobox.stateChangeTypes.InputClick:
                    return {
                        ...changes,
                        isOpen: true,
                    }
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    dispatch({ type: PanelActionTypes.CLEAR })
                    return {
                        ...changes,
                        highlightedIndex: state.highlightedIndex,
                    }
                default:
                    return changes
            }
        },
        onStateChange({
            inputValue: newInputValue = '',
            type,
            selectedItem: newSelectedItem,
        }) {
            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (newSelectedItem) {
                        setSelectedItems([newSelectedItem])
                        setInputValue('')
                    }
                    break

                case useCombobox.stateChangeTypes.InputChange:
                    setInputValue(newInputValue)
                    break
                default:
                    break
            }
        },
    })
    const InputProps = comboBox.getInputProps(
        {
            onKeyPress: (e) => {
                if (fpState.activatedPanel !== 'value' && e.code !== 'Enter') {
                    dispatch({ type: PanelActionTypes.CLEAR })
                    setPanelMode('list')
                }
            },
        },
        { suppressRefError: true }
    )

    const keydownHandler = {
        category: (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.code.includes('Arrow')) {
                e.preventDefault()
            }
            if (e.code === 'ArrowLeft') {
                setInputValue('')
                if (R.isEmpty(fpState.subType.selectedItem)) {
                    moveToTypePanel(dispatch)
                    return
                }
                moveToSubTypePanel(dispatch)
            }
            if (e.code === 'Escape') {
                dispatch({ type: PanelActionTypes.CLEAR })
                comboBox.reset()
            }
        },
        list: (e: React.KeyboardEvent<HTMLDivElement>) => {},
    }

    const typePanelRef = React.useRef<HTMLDivElement>(null)
    const subTypePanelRef = React.useRef<HTMLDivElement>(null)

    // Reset input value when type or subType is changed
    React.useEffect(() => {
        setInputValue('')
    }, [
        fpState.type.selectedItem,
        fpState.subType.selectedItem,
        comboBox.isOpen,
    ])

    // trigger when selectedItems is changed
    React.useEffect(() => {
        if (rest.onChange) {
            rest.onChange(selectedItems)
        }
    }, [selectedItems])

    // trigger when drilled value is changed
    React.useEffect(() => {
        const newValue = init()
        setSelectedItems(newValue)
    }, [value])

    const source = useSource(data)
    const { refs, floatingStyles, placement } = useFloating({
        placement: 'bottom-start',
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        middleware: [
            shift(),
            flip(),
            offset((props) => {
                const { reference } = props.rects
                return {
                    mainAxis: -reference.height,
                }
            }),
        ],
    })

    const classes = classNames(
        ROOT_CLASS,
        {
            [`${ROOT_CLASS}--has-clear-button`]: hasClearButton,
            [`${ROOT_CLASS}--is-open`]: comboBox.isOpen,
        },
        {
            ['--sm']: rest.size === 'sm',
            ['--md']: rest.size === 'md',
            ['--lg']: rest.size === 'lg',
        },
        rest.className
    )

    const panelClasses = classNames(`__panel`, {
        ['--sm']: rest.size === 'sm',
        ['--md']: rest.size === 'md',
        ['--lg']: rest.size === 'lg',
    })

    const wrapperWidth = refs.reference?.current?.getBoundingClientRect().width
    const floatingWidth = rest.floatingWidth || wrapperWidth
    return (
        <Component className={classes} ref={refs.setReference}>
            <AutoCompleteTooltip
                items={[rest.validationMessage]}
                isEnabled={Boolean(rest.validationMessage)}
                validationMessage={rest.validationMessage}
            >
                <div
                    className={classNames(
                        ROOT_CLASS + '__input-wrapper',
                        '--open'
                    )}
                >
                    <div
                        className={classNames(
                            ROOT_CLASS + '__layout-container',
                            {
                                '--warp': rest.overflowerType === 'gradient',
                            }
                        )}
                    >
                        {selectedItems.map((item, i) => (
                            <div key={i}>
                                <p className="autocomplete__ellipsis">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                        <input
                            value={inputValue}
                            disabled={rest.isReadOnly}
                            placeholder={
                                selectedItems.length === 0
                                    ? rest.placeholder
                                    : ''
                            }
                            readOnly
                            className="placeholder"
                            onClick={() => {
                                setPanelMode('list')
                                dispatch({ type: PanelActionTypes.CLEAR })
                                comboBox.toggleMenu()
                            }}
                        />
                        {hasCaretDownIcon && (
                            <Button
                                icon="caretDown"
                                isDisabled={rest.isReadOnly}
                                size="xs"
                                isDangerouslyNaked
                                onClick={() => {
                                    setPanelMode('category')
                                    dispatch({ type: PanelActionTypes.CLEAR })
                                    comboBox.toggleMenu()
                                }}
                                className="--toggle-menu"
                            />
                        )}
                        {hasClearButton &&
                            renderClearButton({
                                style: { right: 20 },
                                onClick: (e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setInputValue('')
                                    setSelectedItems([])
                                    if (onClickClear) {
                                        onClickClear()
                                    }
                                },
                            })}
                    </div>
                </div>
                <div style={{ display: 'none' }} {...comboBox.getMenuProps()} />
                <FloatingPortal>
                    <ClickOutside onClick={() => comboBox.closeMenu()}>
                        {comboBox.isOpen && (
                            <div
                                ref={refs.setFloating}
                                style={{
                                    ...floatingStyles,
                                    width: floatingWidth,
                                    zIndex: 1500,
                                    minWidth: panelMode === 'list' ? 200 : 500,
                                }}
                                className={classNames(ROOT_CLASS, '--shadow')}
                            >
                                {panelMode === 'list' && (
                                    <>
                                        <div
                                            className={classNames(
                                                ROOT_CLASS + '__input-wrapper',
                                                '--focus',
                                                '--open'
                                            )}
                                            onKeyDown={keydownHandler['list']}
                                        >
                                            <div
                                                className={classNames(
                                                    ROOT_CLASS +
                                                        '__layout-container',
                                                    {
                                                        '--warp':
                                                            rest.overflowerType ===
                                                            'gradient',
                                                    }
                                                )}
                                            >
                                                <input
                                                    {...InputProps}
                                                    className="--focus"
                                                    placeholder={
                                                        selectedItems.length ===
                                                        0
                                                            ? ''
                                                            : selectedItems[0]
                                                                  .value
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={classNames(
                                                ROOT_CLASS + '__menu'
                                            )}
                                        >
                                            <div
                                                {...comboBox.getMenuProps({
                                                    ref: parentRef,
                                                })}
                                                className={classNames(
                                                    ROOT_CLASS +
                                                        '__custom-scroll',
                                                    ROOT_CLASS + '__list'
                                                )}
                                            >
                                                {renderDropdown({
                                                    isLoading: false,
                                                    rowVirtualizer,
                                                    items,
                                                    comboBox,
                                                    inputValue,
                                                    selectedItems,
                                                })}
                                            </div>
                                            {rest.hasGuide &&
                                                renderGuide({
                                                    style: {
                                                        border: 'none',
                                                        borderTop:
                                                            'solid 1px var(--gray-125)',
                                                    },
                                                })}
                                        </div>
                                    </>
                                )}
                                {panelMode === 'category' && (
                                    <>
                                        <div
                                            className={classNames(
                                                ROOT_CLASS + '__input-wrapper',
                                                '--focus',
                                                '--open'
                                            )}
                                            onKeyDown={
                                                keydownHandler['category']
                                            }
                                        >
                                            <div
                                                className={classNames(
                                                    ROOT_CLASS +
                                                        '__layout-container',
                                                    {
                                                        '--warp':
                                                            rest.overflowerType ===
                                                            'gradient',
                                                    }
                                                )}
                                            >
                                                <input
                                                    {...InputProps}
                                                    onKeyDown={
                                                        fpState.activatedPanel !==
                                                        'value'
                                                            ? (e) => {
                                                                  inputKeyDownHandler(
                                                                      e,
                                                                      fpState,
                                                                      typePanelRef,
                                                                      subTypePanelRef,
                                                                      dispatch,
                                                                      source
                                                                  )
                                                              }
                                                            : comboBox.getInputProps()
                                                                  .onKeyDown
                                                    }
                                                    autoFocus
                                                    className="--focus"
                                                    placeholder={
                                                        selectedItems.length ===
                                                        0
                                                            ? ''
                                                            : selectedItems[0]
                                                                  .value
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={classNames(
                                                ROOT_CLASS + '__menu'
                                            )}
                                        >
                                            <div className="--flex">
                                                <div
                                                    className={classNames(
                                                        panelClasses,
                                                        ROOT_CLASS + '__panel',
                                                        '--activated',
                                                        ROOT_CLASS +
                                                            '__custom-scroll'
                                                    )}
                                                    ref={typePanelRef}
                                                >
                                                    {/* Type Panel  */}
                                                    {renderFakePanel({
                                                        items: source,
                                                        highlightIndex:
                                                            fpState.type.index,
                                                        displayProps: {
                                                            label: 'type',
                                                            amount: 'count',
                                                        },
                                                        hasDesc: true,
                                                        isActivated:
                                                            fpState.activatedPanel ===
                                                            'type',
                                                        onMouseOver(idx) {
                                                            if (
                                                                R.isEmpty(
                                                                    fpState.type
                                                                        .selectedItem
                                                                )
                                                            ) {
                                                                dispatch({
                                                                    type: PanelActionTypes
                                                                        .UPDATE
                                                                        .TYPE,
                                                                    payload: {
                                                                        index: idx,
                                                                    },
                                                                })
                                                            }
                                                        },
                                                        onClick(idx) {
                                                            if (
                                                                source[idx]
                                                                    .subType
                                                                    .length ===
                                                                0
                                                            ) {
                                                                dispatch({
                                                                    type: PanelActionTypes
                                                                        .STEP
                                                                        .VALUE,
                                                                })
                                                            } else {
                                                                dispatch({
                                                                    type: PanelActionTypes
                                                                        .STEP
                                                                        .SUBTYPE,
                                                                })
                                                            }
                                                            dispatch({
                                                                type: PanelActionTypes
                                                                    .UPDATE
                                                                    .TYPE,
                                                                payload: {
                                                                    index: idx,
                                                                    selectedItem:
                                                                        source[
                                                                            idx
                                                                        ],
                                                                },
                                                            })
                                                        },
                                                    })}
                                                </div>
                                                <div
                                                    ref={subTypePanelRef}
                                                    className={classNames(
                                                        panelClasses,
                                                        ROOT_CLASS + '__panel',
                                                        ROOT_CLASS +
                                                            '__custom-scroll',
                                                        {
                                                            '--activated':
                                                                fpState.type
                                                                    .selectedItem
                                                                    .subType
                                                                    ?.length >
                                                                0,
                                                        }
                                                    )}
                                                >
                                                    {/* SubType */}
                                                    {renderFakePanel({
                                                        items: fpState.type
                                                            .selectedItem
                                                            .subType,
                                                        highlightIndex:
                                                            fpState.subType
                                                                .index,
                                                        displayProps: {
                                                            label: 'value',
                                                            amount: 'count',
                                                        },
                                                        hasCheckIcon: false,
                                                        hasDetail: false,
                                                        isActivated:
                                                            fpState.activatedPanel ===
                                                            'subType',
                                                        onMouseOver(idx) {
                                                            if (
                                                                R.isEmpty(
                                                                    fpState
                                                                        .subType
                                                                        .selectedItem
                                                                ) &&
                                                                fpState.activatedPanel ===
                                                                    'subType'
                                                            ) {
                                                                dispatch({
                                                                    type: PanelActionTypes
                                                                        .UPDATE
                                                                        .SUBTYPE,
                                                                    payload: {
                                                                        index: idx,
                                                                    },
                                                                })
                                                            }
                                                        },
                                                        onClick(idx) {
                                                            dispatch({
                                                                type: PanelActionTypes
                                                                    .STEP.VALUE,
                                                            })
                                                            dispatch({
                                                                type: PanelActionTypes
                                                                    .UPDATE
                                                                    .SUBTYPE,
                                                                payload: {
                                                                    index: idx,
                                                                    selectedItem:
                                                                        fpState
                                                                            .type
                                                                            .selectedItem
                                                                            .subType[
                                                                            idx
                                                                        ],
                                                                },
                                                            })
                                                        },
                                                    })}
                                                </div>
                                                <div
                                                    style={{
                                                        flexGrow: 5,
                                                        border: 'none',
                                                    }}
                                                    className={classNames(
                                                        panelClasses +
                                                            '--value',
                                                        ROOT_CLASS + '__menu'
                                                    )}
                                                >
                                                    <div
                                                        style={{
                                                            overflow: 'auto',
                                                            maxHeight: 210,
                                                        }}
                                                        className={classNames(
                                                            ROOT_CLASS +
                                                                '__custom-scroll'
                                                        )}
                                                        {...comboBox.getMenuProps(
                                                            { ref: parentRef }
                                                        )}
                                                    >
                                                        {fpState.activatedPanel ===
                                                            'value' &&
                                                            renderDropdown({
                                                                isLoading:
                                                                    false,
                                                                rowVirtualizer,
                                                                items,
                                                                comboBox,
                                                                inputValue,
                                                                selectedItems,
                                                            })}
                                                    </div>
                                                </div>
                                            </div>
                                            {rest.hasGuide && renderGuide()}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </ClickOutside>
                </FloatingPortal>
            </AutoCompleteTooltip>
        </Component>
    )
}

type ExcludedProps = 'hasDetail' | 'hasCheckIcon' | 'isSingle'

AutoComplete.defaultProps = {
    hasCaretDownIcon: true,
    hasClearButton: true,
    hasGuide: false,
    creatable: false,
    overflowerType: 'gradient',
    isSingle: true,
    placeholder: 'Select',
    size: 'md',
}

//@ts-ignore
interface Props extends Omit<AutocompleteProps, ExcludedProps> {
    data: Item[]
    hasCaretDownIcon: boolean
    validationMessage?: string
    hasGuide?: boolean
    creatable?: boolean
    size: 'sm' | 'md' | 'lg'
    overflowerType: 'gradient' | 'ellipsis'
    // isSingle: boolean;
    placeholder: string
    onChange?: (value: Item[]) => void
    defaultValue?: Item
    value?: Item

    // Added on request
    floatingWidth?: number // using custom width for floating panel (can't be smaller than minwidth)
    onClickClear?: () => void // trigger when clear button is clicked
    onPanelOpen?: (e: any) => any // trigger when panel is opened
}

export default AutoComplete
