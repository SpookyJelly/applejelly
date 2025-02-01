import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "applejelly";
import { ICON_POSITION, iconKeys, LEVEL, TSHIRT_SIZE } from "../constants";

const meta = {
  title: "applejelly/common/Icon",
  component: Icon,
  args: {
    name: "check",
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: TSHIRT_SIZE },
    name: { control: "select", options: iconKeys },
    hasInlineCentering: { control: "boolean" },
    isScaleDown: { control: "boolean" },
    fill: { control: "color" },
    color: { control: "color" },
    viewBox: { control: "text" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
