import { defaultOptions } from './shared'

const basicThousandUnit = 1000
const binaryThousandUnit = 1024
const space = ' '

function baseFormattedNumber(
    originalValue,
    reference,
    units,
    maxDecimals = 2,
    extraOptions = {}
) {
    let position: undefined | string = undefined
    let value = originalValue
    const options = {
        ...defaultOptions,
        ...extraOptions,
    }

    const {
        willDiscardTrailingZeros,
        hasThousandsSeparator,
        shouldFormatInBinary,
    } = options

    if (value === 0) {
        return {
            value: '0',
            unit: units.get(0) || '',
            hasInternalSpace: false,
        }
    }
    if (reference === 0) {
        return {
            value: '0',
            unit: units.get(0) || '',
            hasInternalSpace: false,
        }
    }

    const thousandUnit = shouldFormatInBinary
        ? binaryThousandUnit
        : basicThousandUnit
    let exponent = Math.floor(
        Math.log(Math.abs(reference)) / Math.log(thousandUnit)
    )

    if (
        (reference >=
            basicThousandUnit * Math.pow(binaryThousandUnit, exponent) &&
            reference < Math.pow(binaryThousandUnit, exponent + 1) &&
            (exponent++,
            (value = Math.pow(binaryThousandUnit, exponent)),
            (reference = Math.pow(binaryThousandUnit, exponent))),
        !units.has(exponent))
    ) {
        const keys = units.keys()
        exponent > 0
            ? ((exponent = Math.max.apply(Math, [...keys])), (position = 'top'))
            : ((exponent = Math.min.apply(Math, [...keys])),
              (position = 'bottom'))
    }

    reference *= Math.pow(basicThousandUnit / thousandUnit, exponent)

    const referenceExponent = Math.floor(Math.log10(Math.abs(reference))) + 1

    let fractionDigits = Math.min(
        maxDecimals,
        3 * (1 + exponent) - referenceExponent
    )
    if (position) {
        if (position === 'top') {
            fractionDigits = 0
        } else if (
            (fractionDigits = 3 * (1 + exponent) - referenceExponent - 2) >
            maxDecimals
        ) {
            return {
                value: `<${space}${Math.pow(10, -1 * maxDecimals)}`,
                unit: units.get(exponent) || '',
                hasInternalSpace: false,
            }
        }
    }
    const formattedValue = value / Math.pow(thousandUnit, exponent)
    let formattedString = formattedValue.toFixed(fractionDigits)

    if (hasThousandsSeparator) {
        formattedString = formattedValue.toLocaleString('en-US', {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        })
    }
    if (willDiscardTrailingZeros) {
        formattedString = formattedValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: fractionDigits,
        })
    }

    return {
        value: formattedString,
        unit: units.get(exponent) || '',
        hasInternalSpace: false,
    }
}

export default baseFormattedNumber
