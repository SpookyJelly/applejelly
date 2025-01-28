import * as React from 'react'
import Checkbox from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/form/Checkbox',
    component: Checkbox,
}

type Story = StoryObj<typeof Checkbox>

export const Basic: Story = {
    args: {},
}
