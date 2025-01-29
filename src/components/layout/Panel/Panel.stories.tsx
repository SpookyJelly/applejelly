import * as React from 'react'
import Panel from './index'
import Flex from '../../layout/Flex'
import Text from '../../typography/Text'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/layout/Panel',
    component: Panel,
}
type Story = StoryObj<typeof Panel>

const content = (
    <Flex alignItems="flex-start">
        <Text marginLeft="md">
            Lorem ipsum dolor amet photo booth wolf mixtape, hell of
            williamsburg selfies kogi tumblr synth schlitz. XOXO air plant pok
            pok chia tumeric squid venmo. Bitters fingerstache beard art party
            subway tile, raw denim next level asymmetrical mlkshk mumblecore
            plaid trust fund 90's hella. Direct trade intelligentsia godard
            chartreuse flannel etsy shoreditch small batch pok pok typewriter
            palo santo pitchfork listicle green juice four dollar toast.
        </Text>
    </Flex>
)

export const Basic: Story = {
    args: {},
    render: (args) => <Panel {...args}>{content}</Panel>,
}
