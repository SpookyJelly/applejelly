import React from 'react'
import { isFullEmpty } from '@daimre/shared'
import { useResolvedElement } from '../hooks'
import { ThemeContext } from '../theme'
import { getComputedStyleProperty } from '../base'
import { adjustColorBrightnessOrDarkness, isBright } from './modifier'
import { getUnderlyingTokenValue } from './designToken-utils'

const extractVariableName = /var\(([\w-]+)\)/;
const toArray = value => Array.isArray(value) ? value : [value, value];

function setCustomComponentStyles(
  elementRef,
  cssVariablePrefix,
  textColor,
  backgroundColor
) {

  // if (isFullEmpty(textColor) && isFullEmpty(backgroundColor)) return {};
  // if (isFullEmpty(elementRef) || isFullEmpty(elementRef.current)) {
  //   return {}
  // }

  const resolvedElement = useResolvedElement(elementRef, document);
  const themeContext = React.useContext(ThemeContext);

  return React.useMemo(() => {
    const styles = {};

    const [lightTextColor, darkTextColor] = toArray(textColor);
    const [lightBackgroundColor, darkBackgroundColor] = toArray(backgroundColor);
    const isLightTheme = themeContext === 'light';

    const activeTextColor = isLightTheme ? lightTextColor : darkTextColor;
    const activeBackgroundColor = isLightTheme ? lightBackgroundColor : darkBackgroundColor;
    let hoverBackgroundColor = activeBackgroundColor;

    if (backgroundColor && activeBackgroundColor) {
      const extractedVariable = activeBackgroundColor.match(extractVariableName);
      if (extractedVariable && resolvedElement) {
        const computedStyleProp = getComputedStyleProperty(extractedVariable[1], resolvedElement)
        hoverBackgroundColor = computedStyleProp.trim() || activeBackgroundColor;
      }

      hoverBackgroundColor = adjustColorBrightnessOrDarkness(
        isLightTheme ? "darker" : "brighter",
        isLightTheme ? 0.2 : 0.5,
        hoverBackgroundColor,
        true
      );
    }

    let effectiveTextColor = activeTextColor;
    if (!textColor && hoverBackgroundColor) {
      effectiveTextColor = getUnderlyingTokenValue(isBright(hoverBackgroundColor) ? "@ui-text--light" : "@ui-text--dark");
    }

    styles[`--${cssVariablePrefix}-custom-text-color`] = effectiveTextColor;
    styles[`--${cssVariablePrefix}-custom-background-color`] = activeBackgroundColor;
    styles[`--${cssVariablePrefix}-custom-background-color-hover`] = hoverBackgroundColor;

    return styles;
  }, [backgroundColor, cssVariablePrefix, resolvedElement, textColor, themeContext]);
}

export default setCustomComponentStyles
