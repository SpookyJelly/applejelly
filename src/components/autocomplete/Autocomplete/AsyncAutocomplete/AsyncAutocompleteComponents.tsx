import React from 'react'
import * as R from 'ramda'
import classNames from 'classnames'
import { renderFakePanel } from '../dropdownEl'
import { PanelState, PanelAction, PanelActionTypes } from '../../shared/types'
import { CategoryProps, BLOCK } from '.'
import Button from '../../../form/Button'
import { UseComboboxActions } from 'downshift'
import { asyncAutocompleteStorageUtil } from './utils'
import { renderGuide } from '../../shared/commons'

/**
 * Fake Panel Components
 */

export const FakeTypePanelComponent = React.forwardRef<
    HTMLDivElement,
    FakePanelProps
>(({ fpState, items, dispatch, rootClass, panelClass }, ref) => {
    return (
        <div
            ref={ref}
            className={classNames(
                panelClass,
                rootClass + '__panel',
                rootClass + '__custom-scroll',
                '--activated'
            )}
        >
            {renderFakePanel({
                items,
                highlightIndex: fpState.type.index,
                displayProps: { label: 'key', amount: 'count' },
                hasDesc: true,
                isActivated: fpState.activatedPanel === 'type',
                onMouseOver(idx: number) {
                    if (R.isEmpty(fpState.type.selectedItem)) {
                        dispatch({
                            type: PanelActionTypes.UPDATE.TYPE,
                            payload: { index: idx },
                        })
                    }
                },
                onClick(idx) {
                    if (items[idx].subType?.length === 0) {
                        dispatch({ type: PanelActionTypes.STEP.VALUE })
                    } else {
                        dispatch({ type: PanelActionTypes.STEP.SUBTYPE })
                    }
                    dispatch({
                        type: PanelActionTypes.UPDATE.TYPE,
                        payload: { index: idx, selectedItem: items[idx] },
                    })
                },
            })}
        </div>
    )
})

export const FakeSubTypePanelComponent = React.forwardRef<
    HTMLDivElement,
    FakePanelProps
>(
    (
        { fpState, items, dispatch, rootClass, panelClass }: FakePanelProps,
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={classNames(
                    panelClass,
                    rootClass + '__panel',
                    rootClass + '__custom-scroll',
                    {
                        '--activated':
                            fpState.type.selectedItem.subType?.length > 0,
                    }
                )}
            >
                {renderFakePanel({
                    items,
                    highlightIndex: fpState.subType.index,
                    displayProps: { label: 'key', amount: 'count' },
                    hasDesc: true,
                    hasCheckIcon: false,
                    hasDetail: false,
                    isActivated: fpState.activatedPanel === 'subType',
                    onMouseOver(idx) {
                        if (
                            R.isEmpty(fpState.subType.selectedItem) &&
                            fpState.activatedPanel === 'subType'
                        ) {
                            dispatch({
                                type: PanelActionTypes.UPDATE.SUBTYPE,
                                payload: { index: idx },
                            })
                        }
                    },
                    onClick(idx) {
                        dispatch({ type: PanelActionTypes.STEP.VALUE })
                        dispatch({
                            type: PanelActionTypes.UPDATE.SUBTYPE,
                            payload: {
                                index: idx,
                                selectedItem:
                                    fpState.type.selectedItem.subType[idx],
                            },
                        })
                    },
                })}
            </div>
        )
    }
)

interface FakePanelProps {
    rootClass: string
    panelClass: string
    fpState: PanelState
    items: CategoryProps[]
    dispatch: (value: PanelAction) => void
}

/**
 * Recent Search Panel Components
 */

export const RecentSearchPanelComponent = ({
    inputValue,
    comboBox,
    setSelectedItems,
    type,
    displayProperties,
    fpState,
    rootClassName = '',
}: RecentSearchPanelProps) => {
    const originData = asyncAutocompleteStorageUtil.get()
    const SUB_CLASSNAME = '__recent-search'

    const data = (function getData(
        type: RecentSearchPanelProps['type'],
        kind: string
    ) {
        if (type === 'list') {
            return originData
        } else {
            const filteredItems = originData.filter(
                (item) =>
                    String(item['content'][kind]).toLowerCase() ===
                    String(fpState.type.selectedItem.key).toLowerCase()
            )
            return filteredItems
        }
    })(type, displayProperties.kind)

    const renderNoResult = () => (
        <div
            className={classNames(rootClassName + SUB_CLASSNAME + '-no-result')}
        >
            No Recent Search
        </div>
    )

    const renderItem = (item: (typeof data)[0]) => (
        <div
            key={item.value}
            className={classNames(rootClassName + SUB_CLASSNAME + '-item')}
            onClick={() => {
                setSelectedItems([item])
                comboBox.closeMenu()
            }}
        >
            <span
                className={classNames('value', rootClassName + '__ellipsis')}
                title={item.value}
            >
                {item.value}
            </span>
            <span className="type">{item.type} </span>
            <Button
                icon="cancel"
                size="xs"
                isDangerouslyNaked
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    const updatedItems = R.without([item], originData)
                    asyncAutocompleteStorageUtil.set(updatedItems)
                    comboBox.closeMenu()
                    comboBox.openMenu()
                }}
            />
        </div>
    )
    const renderItems = R.map(renderItem)

    return (
        <div className={classNames(rootClassName + SUB_CLASSNAME + '-wrapper')}>
            <div
                className={classNames(
                    rootClassName + SUB_CLASSNAME + '-header'
                )}
            >
                <p>Recently Searched</p>
            </div>
            <div
                className={classNames(
                    rootClassName + SUB_CLASSNAME + '-content'
                )}
            >
                {R.ifElse(R.isEmpty, renderNoResult, renderItems)(data)}
            </div>
        </div>
    )
}

interface RecentSearchPanelProps {
    inputValue: string
    comboBox: UseComboboxActions<any>
    setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>
    type: 'list' | 'category'
    fpState: PanelState
    displayProperties: {
        kind: string
        id: string
    }
    rootClassName?: string
}

/**
 *  Input Layout Component
 */

export const ExpandableInputWrapper = ({
    rootClass,
    isOpen = false,
    overflowerType,
    keydownHandler,
    children,
}: ExpandableInputWrapperProps) => {
    return (
        <div
            className={classNames(rootClass + '__input-wrapper', {
                '--open': isOpen,
                '--focus': isOpen,
            })}
            onKeyDown={keydownHandler}
        >
            <div
                className={classNames(rootClass + '__layout-container', {
                    '--warp': overflowerType === 'gradient',
                })}
            >
                {children}
            </div>
        </div>
    )
}

interface ExpandableInputWrapperProps extends React.HTMLProps<HTMLDivElement> {
    rootClass: string
    type?: 'list' | 'category'
    isOpen?: boolean
    overflowerType: 'gradient' | 'ellipsis'
    keydownHandler?: (e: React.KeyboardEvent<any>) => void
}

/**
 * Guide Component
 */

export const Guide = ({ hasGuide }: { hasGuide: boolean }) => {
    const style = { border: 'none', borderTop: 'solid 1px var(--gray-125)' }
    return hasGuide && renderGuide({ style })
}
