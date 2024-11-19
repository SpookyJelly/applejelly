import { CategoryProps, CategoryTreeProps } from './index'
import { ASYNC_AUTOCOMPLETE_STORAGE_BASE_KEY } from './AsyncAutocompleteStructureProps'
// LocalStorage와의 상호작용을 추상화
const storageUtil = {
    get(key: string) {
        const value = localStorage.getItem(key)
        try {
            return value ? JSON.parse(value) : []
        } catch (error) {
            console.error('Failed to parse JSON', error)
            return []
        }
    },
    set(key: string, value: any) {
        try {
            const stringValue = JSON.stringify(value)
            localStorage.setItem(key, stringValue)
        } catch (error) {
            console.error('Failed to stringify JSON', error)
        }
    },
    remove(key: string) {
        localStorage.removeItem(key)
    },
    clear() {
        localStorage.clear()
    },
}

export const asyncAutocompleteStorageUtil = {
    get(): AsyncStorageType[] {
        return storageUtil.get(ASYNC_AUTOCOMPLETE_STORAGE_BASE_KEY)
    },
    set(value: AsyncStorageType[]) {
        storageUtil.set(ASYNC_AUTOCOMPLETE_STORAGE_BASE_KEY, value)
    },
    remove() {
        storageUtil.remove(ASYNC_AUTOCOMPLETE_STORAGE_BASE_KEY)
    },
    clear() {
        storageUtil.clear()
    },
}

interface AsyncStorageType {
    content: any
    type: string
    value: string
}

/**
 *  AsyncAutocomplete Panel Level based Category 전개를 위해, CategoryProps를
 *  Array<T>에서 Tree 구조로 변경
 */
export function convertCategoryPropsToTree(
    categories: CategoryProps[]
): CategoryTreeProps[] {
    const findChildren = (
        parentKey: string,
        items: CategoryProps[]
    ): CategoryTreeProps[] => {
        return items
            .filter((item) => item.parent === parentKey)
            .map((item) => {
                const hasNoMatchingParent =
                    item.parent &&
                    !categories.some((i) => i.key === item.parent)
                return {
                    ...item,
                    ...(hasNoMatchingParent ? {} : { parent: item.parent }),
                    subType: findChildren(item.key, items),
                }
            })
    }

    const rootItems = categories
        .filter(
            (item) =>
                !item.parent || !categories.some((i) => i.key === item.parent)
        )
        .map((item) => {
            const { parent, ...rest } = item
            return {
                ...rest,
                subType: findChildren(item.key, categories),
            }
        })
    return rootItems
}
