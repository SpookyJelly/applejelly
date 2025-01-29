import * as React from 'react'
import KeyboardShortcut from './index'
import Text from '../Text'
import Spacing from '../../layout/Spacing'

export default {
    title: '@applejelly/typography/KeyboardShortcut',
    component: KeyboardShortcut,
}

export const Basic = (args) => <KeyboardShortcut {...args} />
Basic.args = {
    keys: ['ctrl', 'alt', 'D'],
}

export const Variants = (args) => (
    <>
        <div>
            <Text>{'Default:  '}</Text>
            <KeyboardShortcut keys={['mod', 'C']} />
        </div>
        <div>
            <Text>{'Secondary:  '}</Text>
            <KeyboardShortcut variant="secondary" keys={['mod', 'C']} />
        </div>
        <div>
            <Text>{'Tertiary:  '}</Text>
            <KeyboardShortcut variant="tertiary" keys={['mod', 'C']} />
        </div>
        <div>
            <Text>{'Disabled:  '}</Text>
            <KeyboardShortcut variant="disabled" keys={['mod', 'C']} />
        </div>
        <div
            style={{
                background: 'rgba(0,0,0,0.75)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Spacing as="div" margin="sm">
                <Text variant="knockout">{'Knockout:  '}</Text>
                <KeyboardShortcut variant="knockout" keys={['mod', 'C']} />
            </Spacing>
            <Spacing as="div" margin="sm">
                <Text variant="knockout">{'Secondary knockout:  '}</Text>
                <KeyboardShortcut
                    variant="secondary-knockout"
                    keys={['mod', 'C']}
                />
            </Spacing>
        </div>
    </>
)
