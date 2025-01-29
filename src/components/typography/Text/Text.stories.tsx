import React from 'react'
import Text from './index'
import { Meta, StoryObj } from '@storybook/react'
import Flex from '@applejelly/components/layout/Flex'
import FlexItem from '@applejelly/components/layout/FlexItem'

export default {
    title: '@applejelly/typography/Text',
    component: Text,
}

type Story = StoryObj<typeof Text>

export const Basic: Story = {
    args: {
        as: 'div',
        align: 'left',
        children: 'Just Text',
        size: 'sm',
    },
    render: (args) => {
        return <Text {...args} />
    },
}

export const Example: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex gapX="md">
                <Text>Regular text</Text>
                <Text isItalic>Italic text</Text>
                <Text isMonospace>Monospace text</Text>
            </Flex>
        )
    },
}

export const VariantsSizes: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex gapX="md" wrap="wrap">
                <Text size="xxs">Extra extra small</Text>
                <Text size="xs">Extra small</Text>
                <Text size="sm">Small</Text>
                <Text>Medium (default)</Text>
                <Text size="lg">Large</Text>
                <Text size="xl">Extra large</Text>
                <Text size="xxl">Extra extra large</Text>
                <Text size="inherit">Inherited</Text>
            </Flex>
        )
    },
}

export const VariantsStyles: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex gapX="md" wrap="wrap" alignItems="center">
                <Text>Primary (default)</Text>
                <Text variant="secondary">Secondary</Text>
                <Text variant="tertiary">Tertiary</Text>
                <FlexItem style={{ background: 'black' }} padding="sm">
                    <Text variant="knockout">Knockout</Text>
                </FlexItem>
                <Text variant="success">Success</Text>
                <Text variant="warning">Warning</Text>
                <Text variant="danger">Danger</Text>
                <Text variant="disabled">Disabled</Text>
            </Flex>
        )
    },
}

export const VariantsWeights: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex gapX="md" wrap="wrap" alignItems="center">
                <Text>Normal (default) text</Text>
                <Text weight="bold">Bold text</Text>
                <Text weight="thin">Thin text</Text>
            </Flex>
        )
    },
}

export const VariantsTransforms: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex gapX="md" wrap="wrap" alignItems="center">
                <Text textTransform="none">Default text</Text>
                <Text textTransform="lowercase">Lowercased text</Text>
                <Text textTransform="uppercase">Uppercased text</Text>
                <Text textTransform="capitalize">Capitalized text</Text>
            </Flex>
        )
    },
}

export const VariantsAlign: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex direction="column" isFullWidth alignItems="stretch">
                <Text as="div" align="center">
                    Centered text. Curae consectetur fermentum ut odio blandit
                    cras.
                </Text>
                <Text as="div" align="right">
                    Right aligned text. Curae consectetur fermentum ut odio
                    blandit cras.
                </Text>
            </Flex>
        )
    },
}

export const VariantsEllipsis: Story = {
    args: {},
    render: (args) => {
        return (
            <Text hasEllipsis>
                I’m Text with an ellipsis. Resize me to see the truncation in
                action.
            </Text>
        )
    },
}

export const OverflowWrap: Story = {
    args: {},
    render: (args) => {
        const wrapperStyle = {
            display: 'block',
            minWidth: '50px',
            width: 'min-content',
            maxWidth: '100%',
            overflow: 'auto',
        }

        return (
            <Flex direction="column" gapY="md">
                <Text overflowWrap="normal" style={wrapperStyle}>
                    A text containing a
                    veryveryveryveryveryveryveryveryveryveryvery long word with
                    “normal” overflow-wrap.
                </Text>
                <Text overflowWrap="anywhere" style={wrapperStyle}>
                    A text containing a
                    veryveryveryveryveryveryveryveryveryveryvery long word with
                    “anywhere” overflow-wrap.
                </Text>
                <Text overflowWrap="break-word" style={wrapperStyle}>
                    A text containing a
                    veryveryveryveryveryveryveryveryveryveryvery long word with
                    “break-word” overflow-wrap.
                </Text>
            </Flex>
        )
    },
}

export const Inheritance: Story = {
    args: {},
    render: (args) => {
        return (
            <div
                style={{
                    color: 'var(--ui-status-success-contrast)',
                    fontWeight: 'bold',
                }}
            >
                <Text shouldInherit>
                    I’m Text that’s inheriting color and weight from my parent
                    div.
                </Text>
                <br />
                <br />
                <Text shouldInherit size="xl" weight="normal">
                    I’m inheriting color, too — but I’m defining my own size and
                    weight.
                </Text>
            </div>
        )
    },
}

export const Margins: Story = {
    args: {},
    render: (args) => {
        return (
            <Flex alignItems="center">
                <Text marginBottom="sm">I have a SMALL marginBottom.</Text>
                <Text marginX="md">I have a MEDIUM marginX.</Text>
                <Text marginTop="sm">I have a SMALL marginTop.</Text>
            </Flex>
        )
    },
}
