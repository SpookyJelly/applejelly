import * as React from 'react'
import KeyCap from './index'

export default {
    title: '@applejelly/typography/KeyCap',
    component: KeyCap,
}

export const Basic = (args) => <KeyCap {...args} />
Basic.args = {
    keycap: '⌘',
}

export const Control = (args) => <KeyCap {...args} />
Control.args = {
    keycap: 'alt',
}
