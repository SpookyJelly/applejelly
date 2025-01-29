import * as React from 'react'
import Group from './index'
import Button from '../Button/index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/form/Group',
    component: Group,
}

type Story = StoryObj<typeof Group>

export const Basic: Story = {
    args: {},
    render: () => {
        return (
            <Group>
                <Button label={'test'} />
                <Button icon="agent" label="aaa" iconPosition="left" />
            </Group>
        )
    },
}
