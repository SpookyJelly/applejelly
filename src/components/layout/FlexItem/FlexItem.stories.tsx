import * as React from 'react'
import Flex from '../Flex'
import FlexItem from './index'
import Panel from '../Panel'
import Text from '../../typography/Text'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/layout/FlexItem',
    component: FlexItem,
} as Meta

type Story = StoryObj<typeof FlexItem>

export const Basic: Story = {
    render: (args) => (
        <Flex gap="md">
            <FlexItem as={Panel}>
                <Text>This won't shrink</Text>
            </FlexItem>
            <FlexItem grow basis={0} as={Panel}>
                <Text>
                    This element would grow to take the rest, but would shrink
                    up to zero when there would be not enough space.
                </Text>
            </FlexItem>
        </Flex>
    ),
}

export const Alignment: Story = {
    render: (args) => (
        <Flex gap="md">
            <FlexItem align="start" as={Panel} {...args}>
                <Text>One line</Text>
            </FlexItem>
            <FlexItem as={Panel}>
                <Text>
                    Multiple
                    <br />
                    lines
                    <br />
                    for
                    <br />
                    demonstration
                </Text>
            </FlexItem>
        </Flex>
    ),
}
