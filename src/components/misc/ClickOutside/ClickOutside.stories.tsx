import * as React from 'react'
import ClickOutside from './index'
import { Meta, StoryObj } from '@storybook/block'

export default {
    title: '@applejelly/misc/ClickOutside',
    component: ClickOutside,
}

type Story = StoryObj<typeof ClickOutside>

export const Basic: Story = {
    args: {},
}
