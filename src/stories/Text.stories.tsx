import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "applejelly";

const meta = {
  title: "applejelly/typography/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    shouldInherit: {
      control: {
        type: "boolean",
      },
    },
    variant: {
      control: {
        type: "select",
        options: [
          "default",
          "secondary",
          "tertiary",
          "knockout",
          "success",
          "warning",
          "danger",
          "disabled",
        ],
      },
    },
    weight: {
      control: {
        type: "select",
        options: ["normal", "bold", "thin"],
      },
    },
    isItalic: {
      control: {
        type: "boolean",
      },
    },
    isMonospace: {
      control: {
        type: "boolean",
      },
    },
    hasEllipsis: {
      control: {
        type: "boolean",
      },
    },
    align: {
      control: {
        type: "select",
        options: ["left", "center", "right"],
      },
    },
    textTransform: {
      control: {
        type: "select",
        options: ["none", "uppercase", "lowercase", "capitalize"],
      },
    },
    overflowWrap: {
      control: {
        type: "select",
        options: ["normal", "break-word", "anywhere"],
      },
    },
    whiteSpace: {
      control: {
        type: "select",
        options: ["normal", "nowrap", "pre", "pre-line", "pre-wrap"],
      },
    },
  },
} as Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "Hello World",
  },
};
