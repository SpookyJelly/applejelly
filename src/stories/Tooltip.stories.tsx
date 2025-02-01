import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Tooltip } from "applejelly";

const TooltipContent = <div style={{ color: "white" }}>Tooltips!</div>;
const Display = <div style={{ color: "black" }}>Hover me!</div>;

const meta = {
  title: "applejelly/dialogs/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    contents: TooltipContent,
    children: Display,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
export const Basic: StoryObj<typeof meta> = {
  args: {},
};
