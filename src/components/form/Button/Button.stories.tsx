import * as React from 'react'
import Button from './index'
import { Meta, StoryObj } from '@storybook/block'

export default {
    title: '@next/form/Button',
    component: Button,
}

type Story = StoryObj<typeof Button>

export const Basic: Story = {
    args: {
        label: 'Button',
    },
}
