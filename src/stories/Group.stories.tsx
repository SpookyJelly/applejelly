import type { Meta, StoryObj } from "@storybook/react";
import { Group, Button } from "applejelly";
import { fn } from "@storybook/test";

const meta = {
  title: "applejelly/form/Group",
  component: Group,

  parameters: {
    layout: "centered",
  },
  argTypes: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  decorators: [
    (Story) => {
      return (
        <Group>
          <Button label="Button1" />
          <Button label="Button2" />
          <Button label="Button3" />
        </Group>
      );
    },
  ],
};
