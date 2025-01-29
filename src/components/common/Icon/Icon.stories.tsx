import * as React from 'react'
import Icon from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/common/Icon',
    component: Icon,
}

type Story = StoryObj<typeof Icon>

export const Basic: Story = {
    args: {},
}
