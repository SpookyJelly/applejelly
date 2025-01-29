import * as React from 'react'
import Grid from '../Grid'
import Panel from '../Panel'
import Text from '../../typography/Text'
import GridItem from './index'
import Overflower from '../Overflower'

export default {
    title: '@applejelly/layout/GridItem',
    component: GridItem,
}

export const Basic = (args) => {
    return (
        <Grid columns={2}>
            <Panel>
                <Text>foo</Text>
            </Panel>
            <Panel>
                <Text>bar</Text>
            </Panel>
            <GridItem colSpan={2}>
                <Panel>
                    <Text>foobar</Text>
                </Panel>
            </GridItem>
        </Grid>
    )
}
Basic.args = {}

export const As = (args) => {
    return (
        <Grid columns={2}>
            <GridItem colSpan={2} as={Overflower}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam natus doloremque error illum mollitia ab, quasi
                consequuntur at dicta repudiandae animi vero ducimus non ratione
                deleniti! Repudiandae labore laboriosam sapiente!
            </GridItem>
            <Overflower>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam natus doloremque error illum mollitia ab, quasi
                consequuntur at dicta repudiandae animi vero ducimus non ratione
                deleniti! Repudiandae labore laboriosam sapiente!
            </Overflower>
            <Overflower>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam natus doloremque error illum mollitia ab, quasi
                consequuntur at dicta repudiandae animi vero ducimus non ratione
                deleniti! Repudiandae labore laboriosam sapiente!
            </Overflower>
        </Grid>
    )
}

export const Spanning = (args) => {
    return (
        <Grid columns={3} autoRows>
            <GridItem colSpan={2} as={Panel}>
                <Text>foo</Text>
            </GridItem>
            <GridItem rowSpan={2} as={Panel}>
                <Text>bar</Text>
            </GridItem>
            <Panel>
                <Text>baz</Text>
            </Panel>
        </Grid>
    )
}

export const Placement = (args) => {
    return (
        <Grid columns={3} autoRows>
            <GridItem colSpan={2} as={Panel}>
                <Text>foo</Text>
            </GridItem>
            <GridItem rowSpan={2} as={Panel}>
                <Text>bar</Text>
            </GridItem>
            <GridItem row={3} column={2} as={Panel}>
                <Text>baz</Text>
            </GridItem>
        </Grid>
    )
}

export const Areas = (args) => {
    return (
        <Grid autoRows areas={['foo foo bar', 'foo foo bar', 'baz baz bar']}>
            <GridItem area="foo" as={Panel}>
                <Text>foo</Text>
            </GridItem>
            <GridItem area="bar" as={Panel}>
                <Text>bar</Text>
            </GridItem>
            <GridItem area="baz" as={Panel}>
                <Text>baz</Text>
            </GridItem>
        </Grid>
    )
}

export const Columns = (args) => {
    return (
        <Grid columns={12}>
            <GridItem colSpan="all" as={Panel}>
                <Text>fullWidth</Text>
            </GridItem>

            <GridItem colSpan={6} as={Panel}>
                <Text>1/2</Text>
            </GridItem>
            <GridItem colSpan={6} as={Panel}>
                <Text>1/2</Text>
            </GridItem>

            <GridItem colSpan={4} as={Panel}>
                <Text>1/3</Text>
            </GridItem>
            <GridItem colSpan={4} as={Panel}>
                <Text>1/3</Text>
            </GridItem>
            <GridItem colSpan={4} as={Panel}>
                <Text>1/3</Text>
            </GridItem>

            <GridItem colSpan={3} as={Panel}>
                <Text>1/4</Text>
            </GridItem>
            <GridItem colSpan={3} as={Panel}>
                <Text>1/4</Text>
            </GridItem>
            <GridItem colSpan={3} as={Panel}>
                <Text>1/4</Text>
            </GridItem>
            <GridItem colSpan={3} as={Panel}>
                <Text>1/4</Text>
            </GridItem>

            {/* We're placing the column to the proper column */}
            <GridItem colSpan={4} column={5} as={Panel}>
                <Text>1/3, centered</Text>
            </GridItem>

            {/* Here we make the next column to start from the first instead of continuing in the same row as previous */}
            <GridItem colSpan={2} column={1} as={Panel}>
                <Text>1/6</Text>
            </GridItem>
            <GridItem colSpan={2} as={Panel}>
                <Text>1/6</Text>
            </GridItem>
            <GridItem colSpan={2} as={Panel}>
                <Text>1/6</Text>
            </GridItem>
            <GridItem colSpan={2} as={Panel}>
                <Text>1/6</Text>
            </GridItem>
            <GridItem colSpan={2} as={Panel}>
                <Text>1/6</Text>
            </GridItem>
            <GridItem colSpan={2} as={Panel}>
                <Text>1/6</Text>
            </GridItem>
        </Grid>
    )
}
