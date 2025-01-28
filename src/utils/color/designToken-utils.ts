import React from 'react'
import token from './designToken'
import { ThemeContext } from '../theme'

export const getTokenValue = (property, category) => {
  return token[category][property]
}
export const getUnderlyingTokenValue = (property) => {
  return token.underlying[property]
}
export const useCurrentTheme = (property) => {
  const theme = React.useContext(ThemeContext);
  return token[theme][property]
}
