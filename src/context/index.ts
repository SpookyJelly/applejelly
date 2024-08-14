import React, { createContext, useContext } from 'react'

export const PopoverContext = createContext(null)
export const SizeContext: React.Context<{ [key: string]: unknown }> =
    createContext({})
export const useSizeContext = () => useContext(SizeContext)

export const InputFocusContext = createContext({})
export const useInputFocusContext = () => useContext(InputFocusContext)

export const GroupContext = createContext({})
export const useGroupContext = () => useContext(GroupContext)

export const InPopoverContext = createContext({ isInPopover: false })
export const useInPopoverContext = () => useContext(InPopoverContext)

const featureMap = {
    'z-index-elevation-hook': true,
}
type FeatureType = keyof typeof featureMap
export const FeaturesContext = createContext({
    isFeatureEnabled: (value?: FeatureType) => {
        return featureMap[value as FeatureType]
    },
})
export const useFeature = (feature: FeatureType) => {
    const featureEnabled = React.useContext(FeaturesContext).isFeatureEnabled
    return featureEnabled(feature)
}

export const SidePanelContext = createContext({})

export const ThemeContext = createContext(undefined)
