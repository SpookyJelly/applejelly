import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AutoComplete } from "applejelly";

const meta = {
  title: "applejelly/autocomplete/Autocomplete",
  component: AutoComplete,
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
} satisfies Meta<typeof AutoComplete>;

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
