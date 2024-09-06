import React, { useState, useEffect } from 'react'
import * as R from 'ramda'
import { Item } from '../shared/data'
import AutocompleteProps, {
    PanelAction,
    PanelActionTypes,
} from '../shared/types'
import { getUpdatedList } from './fn'
import { useCombobox, useMultipleSelection } from 'downshift'

export function useAnyVisible(
    ref: React.RefObject<HTMLElement>,
    dependencies: NodeListOf<Element>
) {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                const isAnyVisible = entries.some(
                    (entry) => entry.intersectionRatio < 1
                )
                setIsVisible(isAnyVisible)
            },
            { root: ref.current, rootMargin: '0px', threshold: 0 }
        )
        dependencies.forEach((dependency) => {
            observer.observe(dependency)
        })

        return () => observer.disconnect()
    }, [ref, dependencies])

    return isVisible
}

export const useSource = (data: Item[]) => {
    const source = React.useMemo(() => {
        return R.pipe(
            R.groupBy<Item>(R.prop('type')),
            R.mapObjIndexed((item, key) => {
                const subType = R.pipe(
                    R.collectBy<Item, string>(R.prop('subType')),
                    R.map((x) => ({ value: x[0].subType, count: x.length })),
                    R.reject((e: any) => R.isEmpty(e.value))
                )(item)

                return {
                    type: key,
                    count: item.length,
                    subType: [...subType],
                    item: [...item],
                }
            }),
            R.values
        )(data)
    }, [data])
    return source
}

export const useManagedComboBox = (
    items: Item[],
    dispatch: React.Dispatch<PanelAction>,
    props: Partial<AutocompleteProps>,
    [selectedItems, setSelectedItems]: [
        Item[],
        React.Dispatch<React.SetStateAction<Item[]>>,
    ],
    [inputValue, setInputValue]: [
        string,
        React.Dispatch<React.SetStateAction<string>>,
    ]
) => {
    const comboBox = useCombobox({
        items,
        itemToString(item) {
            return item ? item.value : ''
        },
        defaultHighlightedIndex: undefined,
        selectedItem: null,
        inputValue,
        stateReducer(state, actionAndChanges) {
            const { changes, type } = actionAndChanges
            switch (type) {
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
                        isOpen: props.isSingle ? false : true,
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
                    if (newSelectedItem) {
                        if (props.isSingle) setSelectedItems([newSelectedItem])
                        else {
                            const updatedList = getUpdatedList(
                                selectedItems,
                                newSelectedItem
                            )
                            setSelectedItems(updatedList)
                        }
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
    return comboBox
}

export const useManagedMultipleSelection = ([selectedItems, setSelectedItems]: [
    Item[],
    React.Dispatch<React.SetStateAction<Item[]>>,
]) => {
    const multipleSelection = useMultipleSelection({
        selectedItems,
        defaultActiveIndex: undefined,
        onStateChange({ selectedItems: newSelectedItems = [], type }) {
            switch (type) {
                case useMultipleSelection.stateChangeTypes
                    .SelectedItemKeyDownBackspace:
                case useMultipleSelection.stateChangeTypes
                    .SelectedItemKeyDownDelete:
                case useMultipleSelection.stateChangeTypes
                    .DropdownKeyDownBackspace:
                case useMultipleSelection.stateChangeTypes
                    .FunctionRemoveSelectedItem:
                    setSelectedItems(newSelectedItems)
                    break
                case useMultipleSelection.stateChangeTypes.FunctionReset:
                    setSelectedItems([])
                    break
                default:
                    break
            }
        },
    })
    return multipleSelection
}
