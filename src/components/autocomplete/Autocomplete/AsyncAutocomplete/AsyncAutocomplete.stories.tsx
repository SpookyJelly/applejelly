import * as React from 'react'
import AsyncAutoComplete, { CategoryProps } from './index'
import sampleData from '../sampleData'
import { fn } from '@storybook/test'
import Button from '../../../form/Button'
import Group from '../../../form/Group'

export default {
    title: '@applejelly/autocomplete/AsyncAutocomplete',
    component: AsyncAutoComplete,
    decorators: [
        (Story) => (
            <div style={{ padding: 100 }}>
                <Story />
            </div>
        ),
    ],
    args: {
        onChange: fn(),
    },
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

const newCategoryProps: CategoryProps[] = [
    {
        key: 'Vehicle',
        count: 310,
        deps: 1,
        totalDeps: 2,
    },
    {
        key: 'Order',
        count: 2000,
        deps: 1,
        totalDeps: 3,
    },
    {
        key: 'FROM_TO',
        count: 2000,
        deps: 2,
        parent: 'Order',
        totalDeps: 3,
    },
    {
        key: 'Carrier',
        count: 8000,
        deps: 1,
        totalDeps: 2,
    },
    {
        key: 'Node',
        count: 1200,
        deps: 1,
        totalDeps: 3,
    },
    {
        key: 'Port',
        count: 1250,
        deps: 1,
        totalDeps: 3,
    },
    {
        key: 'REAL',
        count: 900,
        deps: 2,
        totalDeps: 3,
        parent: 'Node',
    },
    {
        key: 'VIRTUAL',
        count: 300,
        deps: 2,
        totalDeps: 3,
        parent: 'Node',
    },
    {
        key: 'BUFFER',
        count: 1000,
        deps: 2,
        totalDeps: 3,
        parent: 'Port',
    },
    {
        key: 'STATION',
        count: 250,
        deps: 2,
        totalDeps: 3,
        parent: 'Port',
    },
    {
        key: 'Segment',
        count: 1800,
        deps: 1,
        totalDeps: 2,
    },

    {
        key: 'Mtl',
        count: 10,
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

/**
 * Stories
 *
 */

export const Basic = (args) => {
    const [category, setCategory] =
        React.useState<CategoryProps[]>(categoryProps)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setCategory(newCategoryProps)
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AsyncAutoComplete
            {...args}
            categoryProps={category}
            queryFunction={queryFn}
            displayProperties={{
                kind: 'type',
                id: 'value',
            }}
        />
    )
}

Basic.args = {
    onChange: (value) => console.log('outside value', value),
    categoryProps: categoryProps,
}

export const ValueInjection = (args) => {
    const [selectedItems, setSelectedItems] = React.useState<any>([])

    const displayProperties = {
        kind: 'type',
        id: 'value',
    }

    // 추출한 key들을 사용하여 새로운 타입 정의
    type TargetType = {
        type: string
        value: string
    }
    const target: TargetType[] = [
        { type: 'Node', value: '603123' },
        { type: 'Vehicle', value: 'v0012' },
        { type: 'Order', value: '240703130622plq' },
        { type: 'Carrier', value: 'c001' },
        { type: 'Buffer', value: 'b001' },
        { type: 'Station', value: 's001' },
        { type: 'Segment', value: '1249' },
        { type: 'Mtl', value: 'm001' },
    ]

    return (
        <div>
            <AsyncAutoComplete
                {...args}
                queryFunction={queryFn}
                displayProperties={displayProperties}
                value={selectedItems}
                onChange={(value) => {
                    setSelectedItems(value)
                }}
            />
            <div>
                <span> Selected Item</span>
                {selectedItems.map((item) => (
                    <div key={item.value}>{JSON.stringify(item)}</div>
                ))}
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    height: 100,
                    padding: 10,
                    border: 'solid 1px var(--gray-125)',
                }}
            >
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: -25,
                            background: 'white',
                            border: 'solid 1px var(--gray-125)',
                            padding: 5,
                        }}
                    >
                        Controller
                    </div>
                </div>
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <div>
                        <Group>
                            <Button
                                label="Node"
                                onClick={() => {
                                    setSelectedItems([target[0]])
                                }}
                            />
                            <Button
                                label="Vehicle"
                                onClick={() => {
                                    setSelectedItems([target[1]])
                                }}
                            />
                            <Button
                                label="Order"
                                onClick={() => {
                                    setSelectedItems([target[2]])
                                }}
                            />
                            <Button
                                label="Carrier"
                                onClick={() => {
                                    setSelectedItems([target[3]])
                                }}
                            />
                        </Group>
                    </div>
                </div>
                <div>
                    <div>
                        <Group>
                            <Button
                                label="Buffer"
                                onClick={() => {
                                    setSelectedItems([target[4]])
                                }}
                            />
                            <Button
                                label="Station"
                                onClick={() => {
                                    setSelectedItems([target[5]])
                                }}
                            />
                            <Button
                                label="Segment"
                                onClick={() => {
                                    setSelectedItems([target[6]])
                                }}
                            />
                            <Button
                                label="MTL"
                                onClick={() => {
                                    setSelectedItems([target[7]])
                                }}
                            />
                        </Group>
                    </div>
                </div>
            </div>
        </div>
    )
}
ValueInjection.args = {
    queryFunction: queryFn,
    categoryProps: categoryProps,
}

export const WidthControl = (args) => {
    return (
        <>
            <div>
                <span>Width : 500</span>
                <div
                    style={{ width: 500, border: 'solid 1px red', padding: 10 }}
                >
                    <AsyncAutoComplete {...args} />
                </div>
            </div>
            <div>
                <span>Width : 300</span>
                <div
                    style={{
                        width: 300,
                        border: 'solid 1px blue',
                        padding: 10,
                    }}
                >
                    <AsyncAutoComplete {...args} />
                </div>
            </div>
            <div>
                <span>Width : 100</span>
                <div
                    style={{
                        width: 100,
                        border: 'solid 1px green',
                        padding: 10,
                    }}
                >
                    <AsyncAutoComplete {...args} />
                </div>
            </div>
        </>
    )
}

WidthControl.args = {
    queryFunction: queryFn,
    categoryProps: categoryProps,
    overflowerType: 'ellipsis',
    displayProperties: {
        kind: 'type',
        id: 'value',
    },
    onClickClear: () => {
        console.log(
            '%cClear button clicked',
            'color: red; font-size: 16px; font-weight: bold;'
        )
    },
    onPanelOpen: (e) => {
        console.log('panel open', e)
    },
}

export const CartegoryInjection = (args) => {
    const [category, setCategory] =
        React.useState<CategoryProps[]>(categoryProps)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setCategory(newCategoryProps)
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AsyncAutoComplete
            {...args}
            categoryProps={category}
            queryFunction={queryFn}
            displayProperties={{
                kind: 'type',
                id: 'value',
            }}
        />
    )
}

CartegoryInjection.args = {
    onChange: (value) => console.log('outside value', value),
}
