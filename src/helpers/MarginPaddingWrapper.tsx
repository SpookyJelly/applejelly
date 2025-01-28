import React from 'react'
import styled from '@emotion/styled'
import type { Size, MarginProps, PaddingProps } from '../types'
import { getRealSize } from '../utils'
import * as R from 'ramda'

const Wrapper = styled.div`

`

const marginAttrs = ['margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginX', 'marginY']
const paddingAttrs = ['padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingX', 'paddingY']
const list = [...marginAttrs, ...paddingAttrs]

const dic: { [key: string]: string } = {
	'marginX': 'marginInline',
	'marginY': 'marginBlock',
	'paddingX': 'paddingInline',
	'paddingY': 'paddingBlock',
}

export default function MarginPaddingWrapper({
  children,
  block,
  className,
  ...props
}: MarginPaddingProps) {
  const baseStyle = {
    display: block ? 'block' : 'inline-block'
  }
  const style = R.keys(props).reduce((acc: any, attr) => {
    if (list.includes(attr)) {
      const _attr = R.defaultTo(attr)(dic[attr])
      acc[_attr] = getRealSize(props[attr] as Size | 'auto')
    }
    return acc
  }, baseStyle)

  return (
    <Wrapper style={style} className={className}>{children}</Wrapper>
  )
}

const genArgTypes = (
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

MarginPaddingWrapper.sbArgTypes = {
  ...genArgTypes(marginAttrs, 'margin'),
  ...genArgTypes(paddingAttrs, 'padding'),
}

interface MarginPaddingProps extends MarginProps, PaddingProps {
	children: React.ReactNode
	block?: boolean
  className?: string
}
