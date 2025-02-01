import type { Meta, StoryObj } from "@storybook/react";
import { KeyboardShortcut } from "applejelly";

const meta = {
  title: "applejelly/typography/KeyboardShortcut",
  component: KeyboardShortcut,

  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} as Meta<typeof KeyboardShortcut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    keys: ["ctrl", "alt", "D"],
  },
};
