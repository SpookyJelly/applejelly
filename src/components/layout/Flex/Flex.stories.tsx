import * as React from 'react'
import Flex from './index'
import FlexItem from '../FlexItem'
import Panel from '../Panel'
import Text from '../../typography/Text'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/layout/Flex',
    component: Flex,
} as Meta

type Story = StoryObj<typeof Flex>

const content = (
    <>
        <Panel>
            <Text>First element</Text>
        </Panel>
        <Panel>
            <Text>
                Second element Second element
                <br />
                Second element Second element
                <br />
                Second element Second element
            </Text>
        </Panel>
        <div style={{ width: 200, height: 100, backgroundColor: 'red' }} />
        <Panel>
            <Text>
                Fourth element
                <br />
                Fourth element
                <br />
                Fourth element
                <br />
                Fourth element
                <br />
                Fourth element
            </Text>
        </Panel>
        <div style={{ width: 200, height: 100, backgroundColor: 'blue' }} />
    </>
)

export const Basic: Story = {
    render: (args) => <Flex {...args}>{content}</Flex>,
}

export const FlexItemExample: Story = {
    render: (args) => (
        <Flex gap="md">
            <FlexItem as={Panel}>
                <Text>This won't shrink</Text>
            </FlexItem>
            <FlexItem grow as={<Panel variant="default" />}>
                <Text>This takes the rest</Text>
            </FlexItem>
            <FlexItem shrink as={Panel}>
                <Text>This can shrink when there is not enough space</Text>
            </FlexItem>
        </Flex>
    ),
}

const content5 = (
    <>
        <Panel>
            <Text>One</Text>
        </Panel>
        <Panel>
            <Text>Two</Text>
        </Panel>
        <Panel>
            <Text>Three</Text>
        </Panel>
        <Panel>
            <Text>Four</Text>
        </Panel>
        <Panel>
            <Text>Five</Text>
        </Panel>
    </>
)

export const GapProps: Story = {
    render: (args) => <Flex gap="md">{content5}</Flex>,
}

export const GapWrappableFlex: Story = {
    render: (args) => (
        <Flex wrap="wrap" gapX="md" gapY="md">
            {content5}
        </Flex>
    ),
}

export const GapWrappableFlexItem: Story = {
    render: (args) => (
        <Flex wrap="wrap" gapX="md" gapY="md">
            <FlexItem as={Panel} grow={1}>
                One
            </FlexItem>
            <FlexItem as={Panel} grow={1}>
                Two
            </FlexItem>
            <FlexItem as={Panel} grow={1}>
                Three
            </FlexItem>
            <FlexItem as={Panel} grow={1}>
                Four
            </FlexItem>
            <FlexItem as={Panel} grow={1}>
                Five
            </FlexItem>
        </Flex>
    ),
}
export const Stretching: Story = {
    render: (args) => (
        <Flex hasStretchedItems gap="md">
            {content5}
            <FlexItem as={Panel} grow={2} maxWidth={150}>
                Six
            </FlexItem>
        </Flex>
    ),
}
