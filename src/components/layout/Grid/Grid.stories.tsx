//@ts-nocheck
import * as React from 'react'
import Grid from './index'
import Panel from '../Panel'
import Text from '../../typography/Text'
import GridItem from '../GridItem'
import { Meta, StoryObj } from '@storybook/react'

export default {
    title: '@applejelly/layout/Grid',
    component: Grid,
}

export const Basic = (args) => {
    return (
        <Grid columns={1}>
            <Grid>
                <Panel>
                    <Text>foo</Text>
                </Panel>
                <Panel>
                    <Text>bar</Text>
                </Panel>
            </Grid>
            <Grid>
                <Panel>
                    <Text>foo</Text>
                </Panel>
                <Panel>
                    <Text>bar</Text>
                </Panel>
                <Panel>
                    <Text>baz</Text>
                </Panel>
            </Grid>
            <Grid>
                {Array(9)
                    .fill('_')
                    .map((_, i) => (
                        <Panel key={i}>
                            <Text>{i}</Text>
                        </Panel>
                    ))}
            </Grid>
        </Grid>
    )
}
Basic.args = {}

export const FixedColumns = () => {
    return (
        <Grid columns={3}>
            {Array(9)
                .fill('_')
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const MinimumWidth = () => {
    return (
        <Grid minWidth={150}>
            {Array(9)
                .fill('_')
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const Width = () => {
    return (
        <Grid width={250}>
            {Array(9)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const Area = () => {
    return (
        <Grid areas="a b c">
            {Array(9)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const Gap = () => {
    return (
        <Grid minWidth={100} gap="xs">
            {Array(9)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const CustomColumns = () => {
    return (
        <Grid columns="repeat(auto-fit, minmax(clamp(50% - var(--grid-gap), 200px, 100%), 1fr))">
            {Array(9)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const Padding = () => {
    return (
        <Grid padding="xl">
            {Array(3)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const JustifyItems = () => {
    return (
        <Grid justifyItems="center">
            {Array(3)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const JustifyContent = () => {
    return (
        <div
            style={{
                border: '1px solid var(--ui-border)',
                padding: '16px',
                width: '100%',
            }}
        >
            <Grid columns="repeat(3, 100px)" justifyContent="center">
                {Array(3)
                    .fill(null)
                    .map((_, i) => (
                        <div
                            key={i}
                            style={{
                                border: '1px solid var(--ui-border)',
                                padding: '16px',
                                width: '100px',
                            }}
                        >
                            <Text>{i}</Text>
                        </div>
                    ))}
            </Grid>
        </div>
    )
}

export const AlignContent = () => {
    return (
        <Grid alignContent="center" style={{ height: 200 }}>
            {Array(3)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const AlignContentSpaceBetween = () => {
    return (
        <Grid alignContent="space-between" columns={2} style={{ height: 200 }}>
            {Array(3)
                .fill(null)
                .map((_, i) => (
                    <Panel key={i}>
                        <Text>{i}</Text>
                    </Panel>
                ))}
        </Grid>
    )
}

export const AutoRows = () => {
    return (
        <Grid columns={2} autoRows>
            <Panel>
                <Text>foo</Text>
            </Panel>
            <Panel>
                <Text>bar</Text>
            </Panel>
            <Grid minWidth={100} gap="sm">
                {Array(4)
                    .fill(null)
                    .map((_, i) => (
                        <Panel key={i}>
                            <Text>{i}</Text>
                        </Panel>
                    ))}
            </Grid>
        </Grid>
    )
}

export const Spanning = () => {
    return (
        <Grid columns={2}>
            <Panel>
                <Text>foo</Text>
            </Panel>
            <GridItem as={Panel} colSpan={2}>
                <Text>bar</Text>
            </GridItem>
            <Panel>
                <Text>baz</Text>
            </Panel>
        </Grid>
    )
}

export const Density = () => {
    return (
        <Grid columns={2} isDense>
            <Panel>
                <Text>foo</Text>
            </Panel>
            <GridItem as={Panel} colSpan={2}>
                <Text>bar</Text>
            </GridItem>
            <Panel>
                <Text>baz</Text>
            </Panel>
        </Grid>
    )
}
