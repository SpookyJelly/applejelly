import * as React from 'react'
import PopoverButton from './index'

export default {
    title: '@applejelly/dialogs/PopoverButton',
    component: PopoverButton,
}

export const Basic = (args) => {
    return <PopoverButton isPadded>Look Mom, I’m in a popup!</PopoverButton>
}
Basic.args = {}
