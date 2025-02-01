import { Meta, StoryObj } from "@storybook/react";
import { KeyCap } from "applejelly";

const meta = {
  title: "applejelly/typography/Keycap",
  component: KeyCap,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} as Meta<typeof KeyCap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    keycap: "⌘",
  },
};

export const Key: Story = {
  args: {
    keycap: "alt",
  },
};
