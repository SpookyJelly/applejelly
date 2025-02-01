import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "applejelly";
import { fn } from "@storybook/test";

const meta = {
  title: "applejelly/form/Checkbox",
  component: Checkbox,

  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isChecked: { type: "boolean" },
    isDisabled: { type: "boolean" },
    isIndeterminate: { type: "boolean" },
    isReadOnly: { type: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
