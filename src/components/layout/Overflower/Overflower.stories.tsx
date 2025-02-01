import * as React from 'react'
import Overflower from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/layout/Overflower',
    component: Overflower,
}

type Story = StoryObj<typeof Overflower>

export const Basic: Story = {
    args: {},
    render: () => {
        return (
            <Overflower maxWidth={100} type="gradient">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum,
                eveniet ducimus, beatae ab necessitatibus suscipit sapiente,
                nobis corporis nisi inventore laudantium reprehenderit ipsum
                mollitia modi facere totam. Atque temporibus doloribus
                necessitatibus fugiat asperiores quibusdam reprehenderit,
                ratione delectus veniam mollitia cupiditate sit esse officiis
                nemo aperiam odit libero blanditiis. Debitis, cupiditate.
            </Overflower>
        )
    },
}
