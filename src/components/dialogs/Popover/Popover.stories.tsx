import * as React from 'react'
import Popover from './index'
import { Meta, StoryObj } from '@storybook/react'
import Button from '@applejelly/components/form/Button'

export default {
    title: '@applejelly/dialogs/Popover',
    component: Popover,
}

type Story = StoryObj<typeof Popover>

export const Basic: Story = {
    args: {
        contents: 'This is a popover',
        isPadded: true,
    },
    render: (args) => {
        return (
            <Popover {...args}>
                <Button label="Popover" />
            </Popover>
        )
    },
}
