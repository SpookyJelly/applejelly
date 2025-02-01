import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HighlightKeywords } from "applejelly";

const meta = {
  title: "applejelly/misc/HighlightKeywords",
  component: HighlightKeywords,

  argTypes: {
    textToHighlight: { control: "text" },
    isCaseSensitive: { control: "boolean" },
    searchWords: { control: "text" },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HighlightKeywords>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  decorators: [
    (Story) => {
      const content =
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sunt!";
      const [value, setValue] = React.useState("Lorem");
      return (
        <>
          <HighlightKeywords searchWords={value} textToHighlight={content} />
          <div style={{ marginTop: 50 }}>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </>
      );
    },
  ],
};
