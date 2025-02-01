import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "applejelly";
import { fn } from "@storybook/test";

const meta = {
  title: "applejelly/time/calendar",
  component: Calendar,

  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    dates: [new Date(), new Date("2025-12-31")],
    limit: {
      min: new Date("2025-01-15"),
      max: new Date("2025-12-31"),
    },
    minDate: new Date("2025-01-15"),
    maxDate: new Date("2025-12-31"),
    canSelectMonth: true,
    canSelectRange: true,
    border: true,
  },
};
