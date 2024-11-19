import * as React from 'react'
import AsyncAutocomplete, { CategoryProps } from './index'
import type { Meta, StoryObj } from '@storybook/react'
import sampleData from './sampleData'

export default {
    title: '@applejelly/autocomplete/AsyncAutocomplete',
    component: AsyncAutocomplete,
}

const categoryProps: CategoryProps[] = [
    {
        key: 'Vehicle',
        count: 30,
        deps: 1,
        totalDeps: 2,
    },
    {
        key: 'Order',
        count: 399,
        deps: 1,
        totalDeps: 3,
    },
    {
        key: 'FROM_TO',
        count: 399,
        deps: 2,
        parent: 'Order',
        totalDeps: 3,
    },
    {
        key: 'Carrier',
        count: 7195,
        deps: 1,
        totalDeps: 2,
    },
    {
        key: 'Node',
        count: 1540,
        deps: 1,
        totalDeps: 3,
    },
    {
        key: 'Port',
        count: 1079,
        deps: 1,
        totalDeps: 3,
    },
    {
        key: 'REAL',
        count: 1200,
        deps: 2,
        totalDeps: 3,
        parent: 'Node',
    },
    {
        key: 'VIRTUAL',
        count: 340,
        deps: 2,
        totalDeps: 3,
        parent: 'Node',
    },
    {
        key: 'BUFFER',
        count: 1059,
        deps: 2,
        totalDeps: 3,
        parent: 'Port',
    },
    {
        key: 'STATION',
        count: 20,
        deps: 2,
        totalDeps: 3,
        parent: 'Port',
    },
    {
        key: 'Segment',
        count: 1563,
        deps: 1,
        totalDeps: 2,
    },

    {
        key: 'Mtl',
        count: 2,
        deps: 1,
        totalDeps: 2,
    },
]

const filterItems = (inputValue: string, selectedItem: {}) => {
    const r2 = selectedItem?.['type']?.['key']
    const l2 = selectedItem?.['subType']?.['key']

    return sampleData
        .filter((item) => {
            if (r2) {
                return item.type.toLowerCase() === r2.toLowerCase()
            }
            return true
        })
        .filter((item) => {
            if (l2) {
                return item.subType.toLowerCase() === l2.toLowerCase()
            }
            return true
        })
        .filter((item) => {
            return item.value.toLowerCase().includes(inputValue.toLowerCase())
        })
}
const queryFn = (inputValue: string, selectedItem: {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(filterItems(inputValue, selectedItem))
        }, 1000)
    })
}
type Story = StoryObj<typeof AsyncAutocomplete>

export const Basic: Story = {
    args: {
        onChange: (value) => console.log('outside value', value),
        categoryProps: categoryProps,
        queryFunction: queryFn,
        displayProperties: {
            kind: 'type',
            id: 'value',
        },
    },
}
