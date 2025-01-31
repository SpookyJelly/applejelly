import type { StorybookConfig } from "@storybook/react-vite";
import "sb-addon-permutation-table";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "sb-addon-permutation-table",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
