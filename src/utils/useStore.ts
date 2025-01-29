//@ts-nocheck
import React from 'react'
import store from 'store2'
import { set, get } from 'lodash'

const getStoredValue = (storageKey) => store.get(storageKey) || {}

export const getStoredPathValue = (storageKey, pathKey, defaultPathValue) => {
    const storedValue = getStoredValue(storageKey)
    return get(storedValue, pathKey, defaultPathValue)
}

export const setStoredValue = (storageKey, pathKey, pathValue) => {
    const storedValue = getStoredValue(storageKey)
    set(storedValue, pathKey, {
        ...storedValue[pathKey],
        ...pathValue,
    })
    try {
        store.set(storageKey, storedValue)
    } catch (error) {
        console.warn(
            'failed to store key '.concat(storageKey, ': ').concat(error)
        )
    }
}

export const deleteStoredValue = (storageKey, pathKey) => {
    const storedValue = getStoredValue(storageKey)
    storedValue && delete storedValue[pathKey]

    try {
        store.set(storageKey, storedValue)
    } catch (error) {
        console.warn(
            'failed to store key '.concat(storageKey, ': ').concat(error)
        )
    }
}

export const getStoredPropertyValue = (storageKey, pathKey, propertyName) => {
    return (getStoredPathValue(storageKey, pathKey) || {})[propertyName]
}

export function useStore(storeInfo, defaultValue, option = {}) {
    const [storageKey, pathKey, propertyName] = storeInfo
    const { isReadOnly = false, isEnabled = true } = option

    const getSafeValue = React.useCallback(
        (value) => {
            return isEnabled && value != null ? value : defaultValue
        },
        [defaultValue]
    )

    const [propertyValue, setPropertyValue] = React.useState(() => {
        const value = getStoredPropertyValue(...storeInfo)
        return getSafeValue(value)
    })

    React.useEffect(() => {
        const value = getStoredPropertyValue(...storeInfo)
        const newValue = getSafeValue(value)
        setPropertyValue(newValue)
    }, [...storeInfo, defaultValue])

    React.useEffect(() => {
        if (isEnabled && !isReadOnly) {
            const newValue =
                propertyValue !== defaultValue ? propertyValue : undefined
            setStoredValue(storageKey, pathKey, { [propertyName]: newValue })
        }
    }, [...storeInfo, propertyValue, defaultValue, isEnabled, isReadOnly])

    return [propertyValue, setPropertyValue]
}
