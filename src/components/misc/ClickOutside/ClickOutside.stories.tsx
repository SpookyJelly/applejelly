import * as React from 'react'
import ClickOutside, { useClickOutsideProps } from './index'
import { Meta, StoryObj } from '@storybook/block'

export default {
    title: '@applejelly/misc/ClickOutside',
    component: ClickOutside,
}

type Story = StoryObj<typeof ClickOutside>

export const Basic: Story = {
    args: {},
    render: (args) => {
        const [count, setCount] = React.useState(0)
        return (
            <ClickOutside
                onClick={() => setCount((prev) => prev + 1)}
                style={{
                    padding: '10px',
                    border: '1px solid red',
                    userSelect: 'none',
                }}
            >
                <p>Click Outside Count : {count}</p>
            </ClickOutside>
        )
    },
}

export const Hook: Story = {
    args: {},
    render: (args) => {
        const [count, setCount] = React.useState(0)
        const clickOutsideProps = useClickOutsideProps({
            isDisabled: false,
            onClick: () => setCount((pre) => pre + 1),
        })
        return (
            <div
                style={{
                    border: 'solid 1px red',
                    padding: 10,
                    userSelect: 'none',
                }}
                {...clickOutsideProps}
            >
                using <code>useClickOutsideProps()</code> makes same result as{' '}
                <code>ClickOutside</code> component
                <p>Number of ClickOutside: {count}</p>
            </div>
        )
    },
}

export const Disabled: Story = {
    args: {},
    render: (args) => {
        const [count, setCount] = React.useState(0)
        return (
            <ClickOutside
                isDisabled
                onClick={() => setCount((prev) => prev + 1)}
                style={{
                    padding: '10px',
                    border: '1px solid red',
                    userSelect: 'none',
                }}
            >
                <p>Click Outside Count : {count}</p>
            </ClickOutside>
        )
    },
}
