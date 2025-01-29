import * as React from 'react'
import OverflowList from './index'
import Button from '../../form/Button'
import PopoverButton from '../../dialogs/PopoverButton'
import Grid from '../../layout/Grid'
import Flex from '../../layout/Flex'
import Tooltip from '../../dialogs/Tooltip'

export default {
    title: '@applejelly/layout/OverflowList',
    component: OverflowList,
}

const useButtons = (count) =>
    React.useMemo(
        () =>
            new Array(count)
                .fill(null)
                .map((_, index) => (
                    <Button key={index} label={`Item #${index + 1}`} />
                )),
        [count]
    )

export const Basic = (args) => {
    return <OverflowList {...args}>{useButtons(10)}</OverflowList>
}
Basic.args = {
    initialShowCount: 10,
}

export const VariantsLines1 = () => {
    return <OverflowList lines={3}>{useButtons(60)}</OverflowList>
}

export const VariantsLines2 = () => {
    return <OverflowList lines={3}>{useButtons(2)}</OverflowList>
}

export const VariantsLines3 = () => {
    return (
        <OverflowList lines={3} hasContainment>
            {useButtons(2)}
        </OverflowList>
    )
}

export const Alignment = () => {
    return <OverflowList justify="center">{useButtons(40)}</OverflowList>
}

export const Height1 = () => {
    return (
        <div style={{ overflow: 'hidden', resize: 'vertical', height: 100 }}>
            <OverflowList lines="auto">{useButtons(60)}</OverflowList>
        </div>
    )
}

export const Height2 = () => {
    return <OverflowList lineHeight={28}>{useButtons(40)}</OverflowList>
}

export const Gap = () => {
    return (
        <OverflowList lines={3} gapX="md" gapY="lg">
            {useButtons(40)}
        </OverflowList>
    )
}

export const HandleComponent = () => {
    const handleComponent = ({ count, hiddenItems, hasAllHidden }) => (
        <PopoverButton
            label={`${hasAllHidden ? '' : '+'}${count}`}
            isNaked={false}
        >
            <Grid columns={4} gap="sm" padding="sm">
                {hiddenItems}
            </Grid>
        </PopoverButton>
    )

    return (
        <OverflowList handleComponent={handleComponent}>
            {useButtons(40)}
        </OverflowList>
    )
}

export const VerticalMode1 = () => {
    const handleComponent = ({ count, hiddenItems, hasAllHidden }) => (
        <PopoverButton
            label={`${hasAllHidden ? '' : '+'}${count}`}
            isNaked={false}
        >
            <Grid columns={3} gap="sm" padding="sm">
                {hiddenItems}
            </Grid>
        </PopoverButton>
    )

    return (
        <OverflowList
            isVertical
            style={{ height: 100, resize: 'vertical', overflow: 'hidden' }}
            handleComponent={handleComponent}
        >
            {useButtons(10)}
        </OverflowList>
    )
}

export const VerticalMode2 = () => {
    const handleComponent = ({ count, hiddenItems, hasAllHidden }) => (
        <PopoverButton
            label={`${hasAllHidden ? '' : '+'}${count}`}
            isNaked={false}
        >
            <Grid columns={3} gap="sm" padding="sm">
                {hiddenItems}
            </Grid>
        </PopoverButton>
    )

    return (
        <OverflowList isVertical lines={3} handleComponent={handleComponent}>
            {useButtons(10)}
        </OverflowList>
    )
}

export const MinItemWidth = () => {
    return (
        <Flex gapY="md" direction="column">
            <OverflowList>{useButtons(40)}</OverflowList>
            <OverflowList minItemWidth="0">{useButtons(40)}</OverflowList>
            <OverflowList minItemWidth="100px">{useButtons(40)}</OverflowList>
        </Flex>
    )
}
