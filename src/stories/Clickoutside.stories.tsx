import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ClickOutside } from "applejelly";
import { fn } from "@storybook/test";

const meta = {
  title: "applejelly/misc/Clickoutside",
  component: ClickOutside,
  args: {},
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: fn(),
    isDisabled: { control: "boolean" },
  },
} satisfies Meta<typeof ClickOutside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  decorators: [
    (Story) => {
      const [count, setCount] = React.useState(0);
      return (
        <>
          <ClickOutside onClick={() => setCount(count + 1)}>
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid red",
              }}
            />
          </ClickOutside>
          <p>Click Outside Count : {count}</p>
        </>
      );
    },
  ],
};
