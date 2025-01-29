//@ts-nocheck
import { is } from 'ramda'

const processString = (str) => {
    if (!is(String, str)) return []

    const matches = str.match(/"(?:\\"|[^"])+"|[^\s]+/gi) || []
    return matches.map((e) =>
        e
            .replace(/(\\\\)/g, '\\')
            .replace(/(\\")/g, '"')
            .replace(/^"(.*)"$/g, '$1')
    )
}

export const searchString = (input = '', options = {}) => {
    const method = options.method || 'match-all'
    const processedInput = processString(
        options.isCaseSensitive ? input : input.toLowerCase()
    )

    return (str) => {
        const processedStr = options.isCaseSensitive ? str : str.toLowerCase()
        if (method === 'match-any') {
            return processedInput.some((word) => processedStr.includes(word))
        } else {
            // Assuming method "match-all" by default
            return processedInput.every((word) => processedStr.includes(word))
        }
    }
}

export const searchRecord = (inputString = '', keys = [], options = {}) => {
    const {
        method = 'match-all',
        isCaseSensitive,
        shouldCheckEveryKey,
    } = options
    const processedInput = processString(
        isCaseSensitive ? inputString : inputString.toLowerCase()
    )
    const objectKeys = shouldCheckEveryKey ? Object.keys(inputString) : keys

    return (obj) => {
        let values = []
        for (const key of objectKeys) {
            const value = obj[key]
            if (Array.isArray(value)) {
                values.push(...value)
            } else {
                values.push(value)
            }
        }

        const processedValues = values
            .filter((val) => typeof val === 'string')
            .map((val) => (isCaseSensitive ? val : val.toLowerCase()))

        if (method === 'match-any') {
            return processedInput.some((inputWord) =>
                processedValues.some((val) => val.includes(inputWord))
            )
        } else {
            return processedInput.every((inputWord) =>
                processedValues.some((val) => val.includes(inputWord))
            )
        }
    }
}
