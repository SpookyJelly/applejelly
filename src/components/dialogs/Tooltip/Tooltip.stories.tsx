import * as React from 'react'
import Tooltip from './index'
import { Meta, StoryObj } from '@storybook/block'

export default {
    title: '@applejelly/dialogs/Tooltip',
    component: Tooltip,
}

type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
    args: {
        contents: <div>Tooltips!</div>,
        children: <div>Floating UI Tooltip</div>,
    },
    render: (args) => {
        return <Tooltip {...args} />
    },
}
