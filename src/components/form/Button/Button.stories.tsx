import * as React from 'react'
import Button from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/form/Button',
    component: Button,
}

type Story = StoryObj<typeof Button>

export const Basic: Story = {
    args: {
        label: 'Button',
    },
}
