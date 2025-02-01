import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { fn } from "@storybook/test";
import { AsyncAutocomplete, CategoryProps } from "applejelly";
import sampleData from "./sampleData";

const categoryProps: CategoryProps[] = [
  {
    key: "Apple",
    count: 30,
    deps: 1,
    totalDeps: 2,
  },
  {
    key: "Banana",
    count: 399,
    deps: 1,
    totalDeps: 3,
  },
  {
    key: "Raisin",
    count: 399,
    deps: 2,
    parent: "Banana",
    totalDeps: 3,
  },
  {
    key: "Orange",
    count: 7195,
    deps: 1,
    totalDeps: 2,
  },
  {
    key: "Mango",
    count: 1540,
    deps: 1,
    totalDeps: 3,
  },
  {
    key: "Grape",
    count: 1079,
    deps: 1,
    totalDeps: 3,
  },
  {
    key: "Peach",
    count: 1200,
    deps: 2,
    totalDeps: 3,
    parent: "Mango",
  },
  {
    key: "Plum",
    count: 340,
    deps: 2,
    totalDeps: 3,
    parent: "Mango",
  },
  {
    key: "Cherry",
    count: 1059,
    deps: 2,
    totalDeps: 3,
    parent: "Grape",
  },
  {
    key: "Lemon",
    count: 20,
    deps: 2,
    totalDeps: 3,
    parent: "Grape",
  },
  {
    key: "Pear",
    count: 1563,
    deps: 1,
    totalDeps: 2,
  },
  {
    key: "Kiwi",
    count: 2,
    deps: 1,
    totalDeps: 2,
  },
];

const filterItems = (inputValue: string, selectedItem: Categ) => {
  const r2 = selectedItem?.["type"]?.["key"];
  const l2 = selectedItem?.["subType"]?.["key"];

  return sampleData
    .filter((item) => {
      if (r2) {
        return item.type.toLowerCase() === r2.toLowerCase();
      }
      return true;
    })
    .filter((item) => {
      if (l2) {
        return item.subType.toLowerCase() === l2.toLowerCase();
      }
      return true;
    })
    .filter((item) => {
      return item.value.toLowerCase().includes(inputValue.toLowerCase());
    });
};
const queryFn = (inputValue: string, selectedItem: {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterItems(inputValue, selectedItem));
    }, 1000);
  });
};

const meta = {
  title: "applejelly/autocomplete/AsyncAutocomplete",
  component: AsyncAutocomplete,
  args: {
    data: categoryProps,
    overflowerType: "gradient",
    size: "md",
    onChange: fn(),
    onClickClear: fn(),
    onPanelOpen: fn(),
    minSearchLength: 1,
  },
  argTypes: {
    hasCaretDownIcon: { type: "boolean" },
    validationMessage: { type: "string" },
    creatable: { type: "boolean" },
    placeholder: { type: "string" },
    minSearchLength: { type: "number" },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AsyncAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  decorators: [
    (Story) => {
      const [category, setCategory] =
        React.useState<CategoryProps[]>(categoryProps);

      //   React.useEffect(() => {
      //     const timer = setTimeout(() => {
      //       setCategory(newCategoryProps);
      //     }, 5000);
      //     return () => clearTimeout(timer);
      //   }, []);

      return (
        <AsyncAutocomplete
          categoryProps={category}
          queryFunction={queryFn}
          displayProperties={{
            kind: "type",
            id: "value",
          }}
        />
      );
    },
  ],
};
