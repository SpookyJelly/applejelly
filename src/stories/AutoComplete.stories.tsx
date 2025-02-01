import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Autocomplete } from "applejelly";

const meta = {
  title: "applejelly/autocomplete/Autocomplete",
  component: Autocomplete,
  args: {
    data: [
      { value: "apple", type: "fruit", subType: "sour" },
      { value: "banana", type: "fruit", subType: "sweet" },
      { value: "cherry", type: "fruit", subType: "sour" },
    ],
    overflowerType: "gradient",
    size: "md",
    onChange: fn(),
    onClickClear: fn(),
    onPanelOpen: fn(),
  },
  argTypes: {
    hasCaretDownIcon: { type: "boolean" },
    validationMessage: { type: "string" },
    creatable: { type: "boolean" },
    placeholder: { type: "string" },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};

export const Guided: Story = {
  args: {
    hasGuide: true,
  },
};
