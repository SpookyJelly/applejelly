import * as R from 'ramda'

const mapIndexed = R.addIndex(R.map)

export function isFullEmpty(value: any) {
	if (typeof value === 'function') {
		throw new Error('value must not be a function')
	}

	return R.or(R.isEmpty(value), R.isNil(value))
}

export function isNotFullEmpty(value: any) {
	return R.and(!R.isNil(value), !R.isEmpty(value))
}

export function defaultTo(alt: any, value: any) {
	value = isFullEmpty(value) ? null : value
	return R.defaultTo(alt)(value)
}

export function defaultToS(value: any, alterValue: any) {
	if (typeof value === 'string') {
		return alterValue
	}

	return value
}

export const defaultToC = R.curryN(2, defaultTo)

export const anyEmpty = R.compose<any, any, any>(R.any(isFullEmpty), R.values)

type isType = (value: any) => string
export const isType:isType = (value) => {
	let kind: string = typeof value

	if (kind === 'object') {
		if (Array.isArray(value)) {
			kind = 'array'
		}
		if (R.is(String, value)) {
			kind = 'string'
		}
		if (value === null) {
			kind = 'null'
		}
	}

	return kind
}

type isTypeCheck = (kind: string, isNot?: boolean) => any
const isTypeCheck: isTypeCheck = (kind, isNot = false)  => R.compose(isNot ? R.not : R.identity, R.equals(kind), isType)
export const isString = isTypeCheck('string')
export const isNotString = isTypeCheck('string', true)
export const isArray = isTypeCheck('array')
export const isNotArray = isTypeCheck('array', true)
export const isNumber = isTypeCheck('number')
export const isNotNumber = isTypeCheck('number', true)
export const isObject = isTypeCheck('object')
export const isNotObject = isTypeCheck('object', true)

export function getDividedArray(data: any[], groupNum: number) {
	if (isNotArray(data)) {
		throw new Error('data must be an array')
	}
	if (groupNum < 1) {
		throw new Error('groupNum must be greater than 0')
	}
	if (data.length !== 0 && groupNum > data.length) {
		throw new Error('groupNum must be less than or equal to the length of data')
	}

	const length = data.length
	if (length === 0) { return [] }
	if (length === 1) {
		return data
	}
	const unitPerGroup = Math.ceil(length / groupNum)
	return [...Array(groupNum)].map((_, i) => {
		const arr = data.slice(unitPerGroup * i, unitPerGroup * (i + 1))
		return arr
	})
}

export const sortChartData = (arr: any) => {
	if (isNotArray(arr)) {
		return []
	}

	return arr.sort((a: any[], b: any[]) => a[0] - b[0])
}


export const serialize = (obj: any) => {

  if (Array.isArray(obj)) {
    return JSON.stringify(obj)
  }

	if (isNotObject(obj)) {
    console.info("obj", typeof obj, obj)
		throw new Error('obj must be an object')
	}

	const keys = R.keys(obj)
	return keys.reduce((acc: string, key: any, i) => {
		const { length } = keys
		const isLast = length === i + 1
		acc += `${key}=${obj[key]}${isLast ? '' : '&'}`
		return acc
	}, '')
}

export const deserialize = (val:string) => R.compose<any, any, any, any>(
	R.fromPairs,
	R.map(R.split('=')),
	R.split('&')
)(val)

export const anyTrueEquals = (oldList: any[], newList: any[]) =>
	R.compose<any, any, any>(
		R.includes(true),
		mapIndexed((obj, i) => !R.equals(obj, newList[i])),
	)(oldList)

export function shuffle<T>(array: T[]): T[] {
	const arr = [...array]
	let currentIndex = arr.length,
		temporaryValue,
		randomIndex

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex -= 1

		temporaryValue = arr[currentIndex]
		arr[currentIndex] = arr[randomIndex]
		arr[randomIndex] = temporaryValue
	}

	return arr
}

export const noop = () => {}

const removeDotNumber = (num: number) => {
	return num > 0 ? Math.floor(num) : Math.ceil(num)
}

export const numberWithCommas = (x: number) => {
	x = isNotNumber(x) ? Number(x) : x
	if (isNaN(x)) {
		return NaN
	}

	const num = removeDotNumber(x)
	return num
		.toFixed(0)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


export function getCssValue<T>(value: T): string {
	if (value === undefined) {
		return 'auto'
	}

  if (isNumber(value)) {
    return `${value}px`
  }

  return value as string
}

