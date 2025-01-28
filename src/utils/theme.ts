import React from 'react'
import { cookieManager } from './cookieManager'
import { calculateScrollbarWidth } from './calculateScrollbarWidth'
import { useUpdatableState } from './hooks'

export const themeModes = {
  dark: 'dark',
  light: 'light'
}
const extendedThemeModes = {
  dark: 'dark',
  light: 'light',
  system: 'system'
}
const themeRootClass = "theme-root"
const colorSchemeValues = {
  dark: 'dark',
  light: 'light',
  noPreference: 'no-preference'
}
const THEME_KEY = "theme";
const CUSTOM_SCROLLBARS_CLASS = "has-custom-scrollbars";
const CUSTOM_SCROLLBARS_WIDTH_VAR = "--custom-scrollbars-width";
const THEME_MODES = {
  dark: "dark-mode",
  light: "light-mode"
};
const COOKIE_EXPIRATION_DAYS = 3650;
const themeChangeListeners = new Set();
const cachedTheme = undefined
export const THEME_CHANGE_SHORTCUT = "ctrl+alt+d";


const detectPreferredColorScheme = function() {
  if (window.matchMedia) {
    const colorSchemes = Object.values(colorSchemeValues);
    return colorSchemes.find(scheme =>
      window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches
    ) || colorSchemeValues.noPreference;
  }
  return colorSchemeValues.noPreference;
};

const setThemeCookie = (theme) => {
  const cookieOptions = {
    expires: COOKIE_EXPIRATION_DAYS,
    secure: true,
    sameSite: "Strict"
  };
  cookieManager.set(THEME_KEY, theme, cookieOptions);
};

const mapExtendedToBasicTheme = function(extendedTheme) {
  if (extendedTheme === extendedThemeModes.light) return themeModes.light;
  if (extendedTheme === extendedThemeModes.dark) return themeModes.dark;

  switch (detectPreferredColorScheme()) {
    case colorSchemeValues.noPreference:
    case colorSchemeValues.light:
      return themeModes.light;
    case colorSchemeValues.dark:
      return themeModes.dark;
    default:
      return themeModes.light;
  }
};

export const getCurrentTheme = function() {
  if (cachedTheme) return cachedTheme;

  const savedThemeKey = cookieManager.get(THEME_KEY)
  const savedTheme = savedThemeKey && extendedThemeModes[savedThemeKey as keyof typeof extendedThemeModes];

  return savedTheme && extendedThemeModes[savedTheme as keyof typeof extendedThemeModes] ?
    (setThemeCookie(savedTheme), savedTheme) :
    (setThemeCookie(extendedThemeModes.light), extendedThemeModes.light);
};

export const getTheme = function() {
  const activeTheme = getCurrentTheme();
  return mapExtendedToBasicTheme(activeTheme);
};

const colorSchemeMetaTag = document.querySelector("meta[name=color-scheme]") || (() => {
  const metaTag = document.createElement("meta");
  metaTag.name = "color-scheme";
  document.head.appendChild(metaTag);
  return metaTag;
})();

export const updateDOMWithTheme = function(theme) {
  Object.values(THEME_MODES).forEach((themeClass) => {
    if (themeClass !== THEME_MODES[theme]) {
      document.body.classList.remove(themeClass);
    }
  });
  document.body.classList.add(THEME_MODES[theme]);
  colorSchemeMetaTag.content = theme === themeModes.light ? "light" : "dark";

  const scrollbarWidth = calculateScrollbarWidth();
  if (scrollbarWidth > 0) {
    document.body.classList.add(CUSTOM_SCROLLBARS_CLASS);
    document.body.style.setProperty(CUSTOM_SCROLLBARS_WIDTH_VAR, `${scrollbarWidth}px`);
  } else {
    document.body.classList.remove(CUSTOM_SCROLLBARS_CLASS);
    document.body.style.removeProperty(CUSTOM_SCROLLBARS_WIDTH_VAR);
  }
};

export const setTheme = function() {
  const theme = cachedTheme ?
    getCurrentTheme() :
    (window.location !== window.parent.location ? themeModes.light : getCurrentTheme());
  updateDOMWithTheme(theme);
};

export const updateTheme = (theme) => {
  setThemeCookie(theme);
  setTheme();
  themeChangeListeners.forEach((listener) => listener(theme));
};


const useTheme = () => {
  const [currentTheme, setCurrentTheme] = React.useState(getCurrentTheme());

  React.useEffect(() => {
    const listener = setCurrentTheme;
    themeChangeListeners.add(listener);
    return () => themeChangeListeners.delete(listener);
  }, [setCurrentTheme]);

  return [currentTheme, updateTheme];
};

const getCurrentAppliedTheme = () => document.body.classList.contains(THEME_MODES[themeModes.dark]) ? themeModes.dark : themeModes.light;

export const useThemeObserver = () => {
  const [currentTheme, setCurrentTheme] = useTheme();
  const [observedTheme, setObservedTheme] = useUpdatableState(currentTheme);

  const observer = React.useMemo(() => {
    const mutationObserver = new MutationObserver(() => {
      const newTheme = document.body.classList.contains(THEME_MODES.light) ? themeModes.light : themeModes.dark;
      setObservedTheme(newTheme);
    });
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return mutationObserver;
  }, [setObservedTheme]);

  React.useEffect(() => {
    return () => observer.disconnect();
  }, [observer]);

  const updateTheme = (theme) => {
    switch (theme) {
      case themeModes.light:
        setCurrentTheme(extendedThemeModes.light);
        break;
      case themeModes.dark:
        setCurrentTheme(extendedThemeModes.dark);
        break;
    }
  };

  return [observedTheme, updateTheme];
};

export const themeClassMap = Object.fromEntries(Object.entries(THEME_MODES).map(([key, mode]) => [key, `${themeRootClass} ${mode}`]));
export const ThemeContext = React.createContext(getCurrentAppliedTheme());
