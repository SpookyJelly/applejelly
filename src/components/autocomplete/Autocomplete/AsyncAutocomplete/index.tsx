/**
 *
 * AsyncVAutoComplete
 *
 */

import React, { useState, useMemo } from 'react'
import * as R from 'ramda'
import classNames from 'classnames'
import '../autocomplete.scss'
import AutocompleteProps, { PanelActionTypes } from '../../shared/types'
import {
    FloatingPortal,
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from '@floating-ui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import ClickOutside from '../../../misc/ClickOutside'
import {
    AutoCompleteTooltip,
    renderClearButton,
    renderGuide,
} from '../../shared/commons'
import { fakePanelReducer } from '../actions'
import {
    inputKeyDownHandler,
    moveToSubTypePanel,
    moveToTypePanel,
} from '../handlers'
import { renderDropdown } from '../dropdownEl'
import {
    ExpandableInputWrapper,
    FakeSubTypePanelComponent,
    FakeTypePanelComponent,
    Guide,
    RecentSearchPanelComponent,
} from './AsyncAutocompleteComponents'
import { useAsyncComboBox, useDidMountEffect } from './hooks'
import { convertCategoryPropsToTree } from './utils'
import Button from '@applejelly/components/form/Button'

export const ROOT_CLASS = 'autocomplete'

function AsyncAutoComplete({
    creatable,
    queryFunction,
    defaultValue,
    value,
    categoryProps,
    onClickClear,
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
        // defaultValue와 value가 없다면 빈 배열을 반환합니다.
        if (!defaultValue && !value) return []
        // value가 존재한다면 배열로 변환하여 반환합니다.
        if (value) return Array.isArray(value) ? value : [value]
        // defaultValue가 존재한다면 배열로 변환하여 반환합니다. (우선 순위는 value보다 낮음 )
        if (defaultValue) return [defaultValue]
        return []
    }

    // trigger when drilled value is changed
    React.useEffect(() => {
        // selectedItems와 value가 같다면 return
        // [] 와 []를 다른 값으로 간주하기 때문에, 무한 setter 호출. 이를 방지하기 위해 삽입
        if (R.equals(value, selectedItems)) {
            return
        }
        const newValue = init()
        setSelectedItems(newValue)
    }, [value])

    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // categoryProps는 업데이트 될 때, selectedItems이 변경될때마다 업데이트 됩니다
    const treeCategoryProps = useMemo(() => {
        const treeProps = convertCategoryPropsToTree(categoryProps)
        return {
            type: treeProps,
            subType: treeProps.find(
                (item) => item.key === fpState.type.selectedItem.key
            )?.subType,
        }
    }, [categoryProps, fpState.type.selectedItem])

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

    useDidMountEffect(() => {
        if (rest.onChange) {
            rest.onChange(selectedItems)
        }
    }, [selectedItems])

    useDidMountEffect(() => {
        if (rest.onPanelOpen) {
            rest.onPanelOpen({ isOpen: comboBox.isOpen, type: panelMode })
        }
    }, [comboBox.isOpen])

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
                            style: { right: 0, background: 'transparent' },
                            onClick: (e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                setInputValue('')
                                setSelectedItems([])
                                // NOTE: clear button 클릭시 외부로 이벤 전송
                                if (onClickClear) {
                                    onClickClear()
                                }
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
                                    width: floatingWidth,
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
                                                                  // treeCategoryProps
                                                                  treeCategoryProps.type
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
                                                    items={
                                                        treeCategoryProps.type
                                                    }
                                                />
                                                {/* SubType */}
                                                <FakeSubTypePanelComponent
                                                    ref={subTypePanelRef}
                                                    rootClass={ROOT_CLASS}
                                                    panelClass={panelClasses}
                                                    fpState={fpState}
                                                    //@ts-ignore
                                                    items={
                                                        treeCategoryProps.subType
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
    // Added on request
    floatingWidth?: number // using custom width for floating panel (can't be smaller than minwidth)
    onClickClear?: () => void // trigger when clear button is clicked
    onPanelOpen?: (e: any) => any // trigger when panel is opened
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
    subType?: CategoryTreeProps[]
    totalDeps: number
    parent?: string
}

export interface RecentSearchData {
    content: any
    type: string
    value: string
}

export default AsyncAutoComplete
