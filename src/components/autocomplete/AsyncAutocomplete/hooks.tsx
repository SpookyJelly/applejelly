import { useCombobox } from 'downshift'
import * as R from 'ramda'
import { asyncAutocompleteStorageUtil } from './utils'
import { PanelAction, PanelActionTypes } from '../shared/types'

export const useAsyncComboBox = ({
    items,
    dispatch,
    selectItemStateHook,
    inputStateHook,
    displayProperty,
}: Props) => {
    const [selectedItems, setSelectedItems] = selectItemStateHook
    const [inputValue, setInputValue] = inputStateHook
    const comboBox = useCombobox({
        items,
        defaultHighlightedIndex: undefined,
        selectedItem: null,
        inputValue,
        stateReducer(state, actionChanges) {
            const { changes, type } = actionChanges
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
                        const existingItems = asyncAutocompleteStorageUtil.get()
                        const filteredItems = existingItems.filter(
                            (item) => !R.equals(item.content, newSelectedItem)
                        )

                        const updatedItems = [
                            {
                                content: newSelectedItem,
                                type: newSelectedItem[displayProperty.kind],
                                value: newSelectedItem[displayProperty.id],
                            },
                            ...filteredItems,
                        ]
                        asyncAutocompleteStorageUtil.set(
                            updatedItems.slice(0, 11)
                        )
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

interface Props {
    items: any[]
    dispatch: (value: PanelAction) => void
    selectItemStateHook: [any[], React.Dispatch<React.SetStateAction<any[]>>]
    inputStateHook: [string, React.Dispatch<React.SetStateAction<string>>]
    displayProperty: {
        kind: string
        id: string
    }
}
