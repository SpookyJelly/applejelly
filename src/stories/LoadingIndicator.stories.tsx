import type { Meta, StoryObj } from "@storybook/react";
import { LoadingIndicator } from "applejelly";
import { fn } from "@storybook/test";
import { TSHIRT_SIZE } from "../constants";

const meta = {
  title: "applejelly/misc/LoadingIndicator",
  component: LoadingIndicator,
  args: {
    size: "md",
  },
  argTypes: {
    isAnimated: { control: "boolean" },
    size: { control: "select", options: TSHIRT_SIZE },
    isKnockout: { control: "boolean" },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
