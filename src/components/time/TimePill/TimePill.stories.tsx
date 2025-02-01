import * as React from 'react'
import TimePill from './index'
import Flex from '../../layout/Flex'

export default {
    title: '@applejelly/time/TimePill',
    component: TimePill,
    parameters: {},
}

export const Basic = (args) => <TimePill {...args} />
Basic.args = {
    msPeriod: 90000000,
}

export const ForceUnits = (args) => {
    return (
        <Flex gap={8}>
            <TimePill {...args} msPeriod={90000000} unit="w" />
            <TimePill {...args} msPeriod={90000000} unit="d" />
            <TimePill {...args} msPeriod={90000000} unit="h" />
            <TimePill {...args} msPeriod={90000000} unit="m" />
            <TimePill {...args} msPeriod={90000000} unit="s" />
            <TimePill {...args} msPeriod={90000000} unit="ms" />
        </Flex>
    )
}

export const Sizes = (args) => {
    return (
        <Flex gap={8}>
            <TimePill msPeriod={900000000} unit="w" size="sm" />
            <TimePill msPeriod={900000000} unit="w" size="md" />
        </Flex>
    )
}

export const Width = (args) => {
    return <TimePill isFullWidth msPeriod={900000000} unit="w" />
}

export const TextLabel = (args) => {
    return <TimePill textLabel="1mo" />
}

export const IconNLevel = (args) => {
    return <TimePill level="success" iconLabel="lightningFilled" />
}
