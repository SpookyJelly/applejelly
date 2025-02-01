import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button, Popover } from "applejelly";

const meta = {
  title: "applejelly/dialogs/Popover",
  component: Popover,
  parameters: {
    layout: "centered", // Positions the component in the middle of the screen
  },
  tags: ["autodocs"],
  args: {
    contents: "This is a popover",
    isPadded: true,
    children: <Button label="Popover" />,
  },
  argTypes: {
    isPadded: { control: "boolean" },
    content: { control: "text" },
    isRounded: { control: "boolean" },
    isHoverable: { control: "boolean" },
    wrapperClassName: { control: "text" },
    onOpen: fn(),
    onClose: fn(),
    onClick: fn(),
    offset: { control: "number" },
    width: { control: "number" },
    isDefaultOpen: { control: "boolean" },
    doesStickToEdges: { control: "boolean" },
    placement: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
} as Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  //   decorators: [
  //     ({ args }) => {
  //       return (
  //         <Popover {...args}>
  //           <button>Hover me</button>
  //         </Popover>
  //       );
  //     },
  //   ],
};
