import * as React from 'react'
import HighlightKeywords from './index'
import { Meta, StoryObj } from '@storybook/react'
import Button from '@applejelly/components/form/Button'

export default {
    title: '@applejelly/misc/HighlightKeywords',
    // componentds,
    component: Button,
}

type Story = StoryObj<typeof Button>

export const Basic: Story = {
    args: {},
    render: (args) => {
        const content =
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sunt!'
        const [value, setValue] = React.useState('Lorem')
        return (
            <>
                <HighlightKeywords
                    searchWords={value}
                    {...args}
                    textToHighlight={content}
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
