import * as R from 'ramda'
import {
  marginPropList,
  paddingPropList,
  lockupPropList,
  customColorList,
  extraDomList,
} from './baseProps'
// import { textProps } from '../components/typography/Text'

const propList = {
  margin: marginPropList,
  padding: paddingPropList,
  lockups: lockupPropList,
  customColor: customColorList,
  extraDom: extraDomList,
  // text: textProps
}

export const genArgTypes = (
  arr: string[],
  cat: string
) => arr.reduce((acc: any, attr) => {
  acc[attr] = {
    table: {
      category: cat,
    },
  }
  return acc
}, {})


export const getSbArgFoldableTypes = (keys: string[]) => {

  return keys.reduce((acc: any, key: any) => {
    const list = propList[key]

    if (!Boolean(list)) {
      return acc
    }

    return {
      ...acc,
      ...genArgTypes(list, key)
    }
  }, {})
}
