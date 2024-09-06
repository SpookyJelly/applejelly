import * as React from 'react'
import LoadingIndicator from './index'
import { Meta, StoryObj } from '@storybook/block'

export default {
    title: '@applejelly/misc/LoadingIndicator',
    component: LoadingIndicator,
}

type Story = StoryObj<typeof LoadingIndicator>
export const Basic: Story = {
    args: {},
}

export const Sizes: Story = {
    render: (args) => {
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <div>
                    <p>xxs</p>
                    <LoadingIndicator size="xxs" {...args} />
                </div>
                <div>
                    <p>xs</p>
                    <LoadingIndicator size="xs" {...args} />
                </div>
                <div>
                    <p>sm</p>
                    <LoadingIndicator size="sm" {...args} />
                </div>
                <div>
                    <p>md</p>
                    <LoadingIndicator size="md" {...args} />
                </div>
                <div>
                    <p>lg</p>
                    <LoadingIndicator size="lg" {...args} />
                </div>
                <div>
                    <p>xl</p>
                    <LoadingIndicator size="xl" {...args} />
                </div>
                <div>
                    <p>xxl</p>
                    <LoadingIndicator size="xxl" {...args} />
                </div>
            </div>
        )
    },
}
