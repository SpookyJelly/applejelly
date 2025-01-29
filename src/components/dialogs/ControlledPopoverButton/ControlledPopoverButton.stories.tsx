import * as React from 'react'
import ControlledPopoverButton from './index'
import PopoverButton from '../PopoverButton'

export default {
    title: '@applejelly/dialogs/ControlledPopoverButton',
    component: ControlledPopoverButton,
    // argTypes: getSbArgFoldableTypes(['margin']),
}

export const Basic = (args) => {
    return (
        <ControlledPopoverButton
            label="You cannot open me!"
            icon={null}
            isOpen={false}
            onOpen={() => alert('You tried to open me!')}
            {...args}
        >
            Playing hide and seek 🤫
        </ControlledPopoverButton>
    )
}
Basic.args = {}

export const Button = (args) => {
    return (
        <PopoverButton label="Change my style" isPadded>
            So shiny ✨
        </PopoverButton>
    )
}
Button.args = {}
