import type { Meta, StoryObj } from "@storybook/react";
import { Panel, Flex, Text } from "applejelly";
import { TSHIRT_SIZE } from "../constants";

const meta = {
  title: "applejelly/layout/Panel",
  component: Panel,

  parameters: {
    layout: "centered",
  },
  argTypes: {
    padding: TSHIRT_SIZE,
    isBorderless: {
      control: {
        type: "boolean",
      },
    },
    shadowLevel: {
      control: { type: "number" },
    },
    variant: {
      control: {
        type: "select",
        options: ["default", "primary", "secondary"],
      },
    },
  },
  tags: ["autodocs"],
} as Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;
const content = (
  <Flex alignItems="flex-start">
    <Text marginLeft="md">
      Lorem ipsum dolor amet photo booth wolf mixtape, hell of williamsburg
      selfies kogi tumblr synth schlitz. XOXO air plant pok pok chia tumeric
      squid venmo. Bitters fingerstache beard art party subway tile, raw denim
      next level asymmetrical mlkshk mumblecore plaid trust fund 90's hella.
      Direct trade intelligentsia godard chartreuse flannel etsy shoreditch
      small batch pok pok typewriter palo santo pitchfork listicle green juice
      four dollar toast.
    </Text>
  </Flex>
);

export const Basic: Story = {
  args: {},
  decorators: [
    (Story) => {
      return <Panel>{content}</Panel>;
    },
  ],
};
