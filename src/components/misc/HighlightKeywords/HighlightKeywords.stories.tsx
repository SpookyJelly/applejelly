import * as React from 'react'
import HighlightKeywords from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/misc/HighlightKeywords',
    component: HighlightKeywords,
}

type Story = StoryObj<typeof HighlightKeywords>

export const Basic: Story = {
    args: {},
    render: (args) => {
        const content =
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sunt!'
        const [value, setValue] = React.useState('Lorem')
        return (
            <>
                <HighlightKeywords
                    textToHighlight={content}
                    searchWords={value}
                    {...args}
                />
                <div style={{ marginTop: 50 }}>
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </>
        )
    },
}
