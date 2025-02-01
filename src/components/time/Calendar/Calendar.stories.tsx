import * as React from 'react'
import Calendar from './index'

export default {
    title: '@applejelly/time/Calendar',
    component: Calendar,
    parameters: {},
}

export const Basic = (args) => <Calendar {...args} />
Basic.args = {
    dates: [new Date(), new Date('2025-12-31')],
    limit: {
        min: new Date('2024-05-01'),
        max: new Date('2025-06-01'),
    },
}
