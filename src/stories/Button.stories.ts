import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "applejelly";
import { ICON_POSITION, iconKeys, LEVEL, TSHIRT_SIZE } from "../constants";

const meta = {
  title: "applejelly/form/Button",
  component: Button,
  args: {
    label: "Button",
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: TSHIRT_SIZE },
    href: { control: "text" },
    isExternal: { control: "boolean" },
    level: {
      control: "select",
      options: LEVEL,
    },
    icon: { control: "select", options: iconKeys },
    iconPosition: { control: "select", options: ICON_POSITION },
    isBorderless: { control: "boolean" },
    isDangerouslyNaked: { control: "boolean" },
    isNaked: { control: "boolean" },
    isShade: { control: "boolean" },
    isFullWidth: { control: "boolean" },
    isActive: { control: "boolean" },
    isHovered: { control: "boolean" },
    isLoading: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isPrimary: { control: "boolean" },
    label: { control: "text" },
    featureStatus: { control: "text" },
    type: { control: "select", options: ["button", "submit", "reset"] },
    hasEllipsis: { control: "boolean" },
    ariaAttrs: { control: "object" },
    dataAttrs: { control: "object" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};

export const Primary: Story = {
  args: {
    isPrimary: true,
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
