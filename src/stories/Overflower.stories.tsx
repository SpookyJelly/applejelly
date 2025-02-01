import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Overflower } from "applejelly";

const meta = {
  title: "applejelly/layout/Overflower",
  component: Overflower,
  parameters: {
    layout: "centered",
  },
  args: {},

  tags: ["autodocs"],
} as Meta<typeof Overflower>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  decorators: [
    (Story) => {
      return (
        <Overflower tooltip="hello world">
          Just a long line of text that would get overflowed.
        </Overflower>
      );
    },
  ],
};
