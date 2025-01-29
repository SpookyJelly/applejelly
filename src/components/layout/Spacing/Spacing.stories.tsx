import * as React from 'react'
import Spacing from './index'
import Text from '../../typography/Text'
import Button from '../../form/Button'

export default {
    title: '@applejelly/layout/Spacing',
    component: Spacing,
}

const pStyles = {
    backgroundColor: 'salmon',
    display: 'inline-block',
}
const cStyles = {
    backgroundColor: 'lightblue',
    display: 'inline-block',
}

export const Basic = (args) => {
    return (
        <Text>
            <Spacing as="div" style={pStyles}>
                <Spacing as="div" style={cStyles} margin="md">
                    (margin: md)
                </Spacing>
            </Spacing>
            <br />
            <br />
            <Spacing as="div" style={pStyles}>
                <Spacing as="div" style={cStyles} padding="md">
                    (padding: md)
                </Spacing>
            </Spacing>
            <br />
            <br />
            <Spacing as="div" style={pStyles}>
                <Spacing as="div" style={cStyles} marginRight="md">
                    (margin-right: md)
                </Spacing>
            </Spacing>
            <br />
            <br />
            <Spacing as="div" style={pStyles}>
                <Spacing as="div" style={cStyles} paddingBottom="sm">
                    (padding-bottom: sm)
                </Spacing>
            </Spacing>
            <br />
            <br />
            <Spacing as="div" style={pStyles}>
                <Spacing as="div" style={cStyles} marginX="md" paddingY="md">
                    (margin-left: md, margin-right: md, padding-top: md,
                    padding-bottom: md)
                </Spacing>
            </Spacing>
        </Text>
    )
}
Basic.args = {}

export const IndividualSides = (args) => {
    return (
        <Spacing
            marginTop="xl"
            marginRight="xl"
            marginBottom="xl"
            marginLeft="xl"
        >
            <Button>I have $"xl" margins on all sides</Button>
        </Spacing>
    )
}

export const AdditionalMargins = (args) => {
    return (
        <>
            <Spacing margin="xl" marginRight="none">
                <Button>
                    I have $"xl" margins on all sides except the right one.
                </Button>
            </Spacing>
            <Spacing marginX="auto">
                <Spacing as="div" style={{ width: 'fit-content' }}>
                    <Button>I have an auto horizontal margin.</Button>
                </Spacing>
            </Spacing>
        </>
    )
}

export const AltRendering1 = (args) => {
    return (
        <Spacing
            marginTop="xl"
            marginRight="xl"
            marginBottom="xl"
            marginLeft="xl"
        >
            <Text>
                I have "xl" margins on all sides — but they have no effect on
                the top and bottom because I have a span layout.
            </Text>
        </Spacing>
    )
}

export const AltRendering2 = (args) => {
    return (
        <Spacing
            as="div"
            marginTop="xl"
            marginRight="xl"
            marginBottom="xl"
            marginLeft="xl"
        >
            <Text>
                I, too, have "xl" margins on all sides — and now they have an
                effect because I have an automatically created parent block
                element.
            </Text>
        </Spacing>
    )
}
