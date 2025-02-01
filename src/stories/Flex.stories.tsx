import type { Meta, StoryObj } from "@storybook/react";
import { Flex, Panel, Text } from "applejelly";
import { fn } from "@storybook/test";
const meta = {
  title: "applejelly/layout/Flex",
  component: Flex,

  parameters: {
    layout: "centered",
  },
  argTypes: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

const content = (
  <>
    <Panel>
      <Text>First element</Text>
    </Panel>
    <Panel>
      <Text>
        Second element Second element
        <br />
        Second element Second element
        <br />
        Second element Second element
      </Text>
    </Panel>
    <div style={{ width: 200, height: 100, backgroundColor: "red" }} />
    <Panel>
      <Text>
        Fourth element
        <br />
        Fourth element
        <br />
        Fourth element
        <br />
        Fourth element
        <br />
        Fourth element
      </Text>
    </Panel>
    <div style={{ width: 200, height: 100, backgroundColor: "blue" }} />
  </>
);

export const Basic: Story = {
  args: {},
  decorators: [
    (Story) => {
      return <Flex>{content}</Flex>;
    },
  ],
};
