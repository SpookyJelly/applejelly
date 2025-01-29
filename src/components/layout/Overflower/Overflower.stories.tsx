import * as React from 'react'
import Overflower from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/layout/Overflower',
    component: Overflower,
}

type Story = StoryObj<typeof Overflower>

export const Basic: Story = {
    args: {},
}
