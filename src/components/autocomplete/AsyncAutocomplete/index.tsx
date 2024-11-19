/**
 *
 * AsyncVAutoComplete
 *
 */

import React, { useState, useMemo } from 'react'
import * as R from 'ramda'
import classNames from 'classnames'
import './async-autocomplete.scss'
import AutocompleteProps, { PanelActionTypes } from '../shared/types'
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
    // renderGuide,
} from '../shared/commons'
import { fakePanelReducer } from '../shared/actions'
import {
    inputKeyDownHandler,
    moveToSubTypePanel,
    moveToTypePanel,
} from '../shared/handlers'
import { renderDropdown } from '../shared/dropdownEl'
import {
    ExpandableInputWrapper,
    FakeSubTypePanelComponent,
    FakeTypePanelComponent,
    Guide,
    RecentSearchPanelComponent,
} from '../AsyncAutocomplete/AsyncAutocompleteComponents'
import { useAsyncComboBox } from './hooks'
import { convertCategoryPropsToTree } from './utils'

export const ROOT_CLASS = 'autocomplete_async-autocomplete'

function AsyncAutoComplete({
    creatable,
    queryFunction,
    defaultValue,
    value,
    categoryProps,
    ...rest
}: Props) {
    const [inputValue, setInputValue] = useState('')
    const [selectedItems, setSelectedItems] = useState<any[]>(value ?? [])
    const [fpState, dispatch] = React.useReducer(fakePanelReducer, {
        type: { index: -1, selectedItem: {} },
        subType: { index: -1, selectedItem: {} },
        activatedPanel: 'type',
    })

    const init = () => {
        if (!defaultValue && !value) return []
        if (value) return Array.isArray(value) ? value : [value]
        if (defaultValue) return [defaultValue]
        return []
    }

    // trigger when drilled value is changed
    React.useEffect(() => {
        const newValue = init()
        setSelectedItems(newValue)
    }, [value])

    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const treeCategoryProps = useMemo(
        () => convertCategoryPropsToTree(categoryProps),
        [categoryProps]
    )

    // Fetch Data When inputValue is not empty and changed
    const fetchData = async (inputValue: string, selectedItem: {}) => {
        setIsLoading(true)
        try {
            // queryFunction을 사용하여 쿼리를 실행합니다. inputValue를 인자로 전달합니다.
            const data = await queryFunction(inputValue, selectedItem)
            setItems(data)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }
    React.useEffect(() => {
        // inputValue가 비어있지 않을 때만 fetchData를 호출합니다.
        if (inputValue.trim() !== '') {
            fetchData(inputValue, {
                type: fpState.type.selectedItem,
                subType: fpState.subType.selectedItem,
            })
        }
    }, [inputValue, queryFunction]) // inputValue와 queryFunction이 변경될 때마다 useEffect가 실행됩니다.

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

    const comboBox = useAsyncComboBox({
        items,
        dispatch,
        selectItemStateHook: [selectedItems, setSelectedItems],
        inputStateHook: [inputValue, setInputValue],
        displayProperty: rest.displayProperties,
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

    // In-component Renderer
    // refer Non-Function parameter
    const valuePanelRenderer = (type: 'list' | 'category') => {
        if (inputValue === '')
            return (
                <RecentSearchPanelComponent
                    inputValue={inputValue}
                    comboBox={comboBox}
                    setSelectedItems={setSelectedItems}
                    type={type}
                    displayProperties={rest.displayProperties}
                    fpState={fpState}
                    rootClassName={ROOT_CLASS}
                />
            )
        if (inputValue.length < rest.minSearchLength)
            return (
                <div className={classNames(ROOT_CLASS + '__indicator')}>
                    Type {rest.minSearchLength - inputValue.length} more
                    characters to search
                </div>
            )
        return renderDropdown({
            isLoading,
            rowVirtualizer,
            items,
            comboBox,
            inputValue,
            selectedItems,
            displayProperties: rest.displayProperties,
        })
    }

    return (
        <Component className={classes} ref={refs.setReference}>
            <AutoCompleteTooltip
                items={[rest.validationMessage]}
                isEnabled={Boolean(rest.validationMessage)}
                validationMessage={rest.validationMessage}
            >
                <ExpandableInputWrapper
                    rootClass={ROOT_CLASS}
                    isOpen={false}
                    overflowerType={rest.overflowerType}
                >
                    {selectedItems.map((item, i) => (
                        <div key={i}>
                            <p
                                className={classNames(
                                    ROOT_CLASS + '__ellipsis'
                                )}
                            >
                                {item[rest.displayProperties.id]}
                            </p>
                        </div>
                    ))}
                    <input
                        value={inputValue}
                        disabled={rest.isReadOnly}
                        placeholder={
                            selectedItems.length === 0 ? rest.placeholder : ''
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
                            isNaked
                            // isBorderless
                            // isShade
                            // isDangerouslyNaked
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
                            },
                        })}
                </ExpandableInputWrapper>
                {/* NOTE: downshift ref Error를 제거하기 위해 삽입 */}
                <div style={{ display: 'none' }} {...comboBox.getMenuProps()} />
                <FloatingPortal>
                    <ClickOutside onClick={() => comboBox.closeMenu()}>
                        {comboBox.isOpen && (
                            <div
                                ref={refs.setFloating}
                                style={{
                                    ...floatingStyles,
                                    width: wrapperWidth,
                                    zIndex: 1500,
                                    minWidth: panelMode === 'list' ? 200 : 500,
                                }}
                                className={classNames(ROOT_CLASS, '--shadow')}
                            >
                                {panelMode === 'list' && (
                                    <>
                                        <ExpandableInputWrapper
                                            rootClass={ROOT_CLASS}
                                            isOpen={true}
                                            keydownHandler={
                                                keydownHandler['list']
                                            }
                                            overflowerType={rest.overflowerType}
                                        >
                                            <input
                                                {...InputProps}
                                                className="--focus"
                                                placeholder={
                                                    selectedItems.length === 0
                                                        ? ''
                                                        : selectedItems[0][
                                                              rest
                                                                  .displayProperties
                                                                  .id
                                                          ]
                                                }
                                                autoFocus
                                            />
                                        </ExpandableInputWrapper>
                                        {/* Value */}
                                        <div
                                            className={classNames(
                                                ROOT_CLASS + '__menu',
                                                {
                                                    '--guide': Boolean(
                                                        rest.hasGuide
                                                    ),
                                                }
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
                                                {valuePanelRenderer('list')}
                                            </div>
                                            <Guide
                                                hasGuide={Boolean(
                                                    rest.hasGuide
                                                )}
                                            />
                                        </div>
                                    </>
                                )}
                                {panelMode === 'category' && (
                                    <div>
                                        <ExpandableInputWrapper
                                            rootClass={ROOT_CLASS}
                                            isOpen={true}
                                            overflowerType={rest.overflowerType}
                                            keydownHandler={
                                                keydownHandler['category']
                                            }
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
                                                                  // rest.categoryProps,
                                                                  treeCategoryProps
                                                              )
                                                          }
                                                        : comboBox.getInputProps()
                                                              .onKeyDown
                                                }
                                                autoFocus
                                                className="--focus"
                                                placeholder={
                                                    selectedItems.length === 0
                                                        ? ''
                                                        : selectedItems[0][
                                                              rest
                                                                  .displayProperties
                                                                  .id
                                                          ]
                                                }
                                            />
                                        </ExpandableInputWrapper>

                                        <div
                                            className={classNames(
                                                ROOT_CLASS + '__menu',
                                                {
                                                    '--guide': Boolean(
                                                        rest.hasGuide
                                                    ),
                                                }
                                            )}
                                        >
                                            <div className="--flex">
                                                {/* Type Panel  */}
                                                <FakeTypePanelComponent
                                                    ref={typePanelRef}
                                                    rootClass={ROOT_CLASS}
                                                    panelClass={panelClasses}
                                                    fpState={fpState}
                                                    dispatch={dispatch}
                                                    // items={rest.categoryProps}
                                                    items={treeCategoryProps}
                                                />
                                                {/* SubType */}
                                                <FakeSubTypePanelComponent
                                                    ref={subTypePanelRef}
                                                    rootClass={ROOT_CLASS}
                                                    panelClass={panelClasses}
                                                    fpState={fpState}
                                                    items={
                                                        fpState.type
                                                            .selectedItem
                                                            .subType
                                                    }
                                                    dispatch={dispatch}
                                                />
                                                {/* Value */}
                                                <div
                                                    className={classNames(
                                                        panelClasses +
                                                            '--value',
                                                        ROOT_CLASS + '__menu',
                                                        '--category'
                                                    )}
                                                >
                                                    <div
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
                                                            valuePanelRenderer(
                                                                'category'
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Guide
                                                hasGuide={Boolean(
                                                    rest.hasGuide
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ClickOutside>
                </FloatingPortal>
            </AutoCompleteTooltip>
        </Component>
    )
}

type ExcludedProps =
    | 'hasDetail'
    | 'hasCheckIcon'
    | 'isSingle'
    | 'size'
    | 'onChange'

// NOTE: creatable 기능을
AsyncAutoComplete.defaultProps = {
    hasCaretDownIcon: true,
    hasClearButton: true,
    hasGuide: false,
    overflowerType: 'gradient',
    isSingle: true,
    size: 'md',
    placeholder: 'Select',
    minSearchLength: 2,
}

interface Props extends Omit<AutocompleteProps, ExcludedProps> {
    hasCaretDownIcon: boolean
    validationMessage?: string
    hasGuide?: boolean
    size: 'sm' | 'md' | 'lg'
    overflowerType: 'gradient' | 'ellipsis'
    placeholder: string
    onChange?: (value: any[]) => void
    queryFunction: (inputValue: string, selectedItem: {}) => Promise<any>
    categoryProps: CategoryProps[]
    displayProperties: {
        kind: string
        id: string
    }
    minSearchLength: number
    defaultValue?: any
    value?: any | any[]
}
export interface CategoryTreeProps {
    key: string
    count: number
    deps: number
    subType: CategoryTreeProps[]
    totalDeps: number
    parent?: string
}
export interface CategoryProps {
    key: string
    count: number
    deps: number
    totalDeps: number
    parent?: string
}

export interface RecentSearchData {
    content: any
    type: string
    value: string
}

export default AsyncAutoComplete
