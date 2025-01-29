import * as React from 'react'
import Autocomplete from './index'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/autocomplete/Autocomplete',
    component: Autocomplete,
}

type Story = StoryObj<typeof Autocomplete>
const sample = [
    {
        type: 'node',
        value: '606021',
        subType: 'virtual',
    },
    {
        type: 'node',
        value: '606039',
        subType: 'virtual',
    },
]
export const Basic: Story = {
    args: {
        data: sample,
        hasCaretDownIcon: true,
    },
}
