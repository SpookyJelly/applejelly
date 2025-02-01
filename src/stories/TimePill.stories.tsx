import type { Meta, StoryObj } from "@storybook/react";
import { TimePill } from "applejelly";
import { fn } from "@storybook/test";

const meta = {
  title: "applejelly/time/TimePill",
  component: TimePill,

  parameters: {
    layout: "centered",
  },
  argTypes: {
    unit: {
      control: {
        type: "select",
        options: ["ms", "s", "m", "h", "d", "w"],
      },
    },
  },
  tags: ["autodocs"],
} as Meta<typeof TimePill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    msPeriod: 90000,
    unit: "s",
  },
};
