import * as React from 'react'
import AutoComplete from './index'
import { Item, itemsSample, multiItemsSample } from '../shared/data'
import sampleData from './sampleData'
import { fn } from '@storybook/test'
import Button from '../../form/Button'
import Group from '../../form/Group'

export default {
    title: '@applejelly/autocomplete/Autocomplete',
    component: AutoComplete,
    // argTypes: getSbArgFoldableTypes(['margin']),

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

export const Basic = (args) => <AutoComplete {...args} />
Basic.args = {
    data: sampleData,
    onChange: (value) => console.log('outside value', value),
}

export const ValueInjection = (args) => {
    const [selectedItems, setSelectedItems] = React.useState<Item[]>([])

    const target: Item[] = [
        { type: 'node', subType: '', value: 'sta-node-1' },
        { type: 'port', subType: '', value: 'sta-port-1' },
        { type: 'vehicle', subType: '', value: 'sta-vehicle-1' },
        { type: 'order', subType: '', value: 'order-1' },
        { type: 'mtl', subType: '', value: 'sta-mtl-1' },
        { type: 'mtl', subType: '', value: 'sta-mtl-2' },
        { type: 'charger', subType: '', value: 'sta-charger-1' },
    ]

    return (
        <div>
            <AutoComplete
                value={selectedItems[0]}
                data={target}
                {...args}
                onChange={(value) => {
                    console.log(value)
                    setSelectedItems(value)
                }}
            />
            <div>
                <span> Selected Item</span>
                <div>
                    {selectedItems.map((item) => (
                        <div key={item.value}>{JSON.stringify(item)}</div>
                    ))}
                </div>
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
                            top: -35,
                            background: 'white',
                            border: 'solid 1px var(--gray-125)',
                            padding: 5,
                        }}
                    >
                        Controller
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
                        <div style={{ marginTop: 10 }}>
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
            </div>
        </div>
    )
}
