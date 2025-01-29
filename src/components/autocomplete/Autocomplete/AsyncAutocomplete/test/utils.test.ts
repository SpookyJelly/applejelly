import { expect, describe, it } from "vitest";
import { convertCategoryPropsToTree } from "../utils";
import { CategoryProps, CategoryTreeProps } from "../index";

const props: CategoryProps[] = [
  { key: "vehicle", count: 30, deps: 1, totalDeps: 3 },
  { key: "ams", count: 20, deps: 2, parent: "vehicle", totalDeps: 3 },
  { key: "order", count: 300, deps: 1, totalDeps: 2 },
  { key: "carrier", count: 200, deps: 1, totalDeps: 4 },
  { key: "from", count: 100, deps: 2, totalDeps: 4, parent: "carrier" },
  { key: "to", count: 20, deps: 3, totalDeps: 4, parent: "from" },
  { key: "segment", count: 1563, deps: 1, totalDeps: 3 },
];
const expected: CategoryTreeProps[] = [
  {
    key: "vehicle",
    count: 30,
    deps: 1,
    totalDeps: 3,
    subType: [
      {
        key: "ams",
        count: 20,
        deps: 2,
        totalDeps: 3,
        parent: "vehicle",
        subType: [],
      },
    ],
  },
  {
    key: "order",
    count: 300,
    deps: 1,
    totalDeps: 2,
    subType: [],
  },

  {
    key: "carrier",
    count: 200,
    deps: 1,
    totalDeps: 4,
    subType: [
      {
        key: "from",
        count: 100,
        deps: 2,
        totalDeps: 4,
        parent: "carrier",
        subType: [
          {
            key: "to",
            count: 20,
            deps: 3,
            totalDeps: 4,
            parent: "from",
            subType: [],
          },
        ],
      },
    ],
  },
  {
    key: "segment",
    count: 1563,
    deps: 1,
    totalDeps: 3,
    subType: [],
  },
];

const cases = {
  normal: props,
  improperParents: [
    ...props,
    {
      key: "MTL",
      count: 100,
      deps: 2,
      totalDeps: 4,
      parent: "foo",
    },
  ],
};
const expects = {
  normal: expected,
  improperParents: [
    ...expected,
    {
      key: "MTL",
      count: 100,
      deps: 2,
      totalDeps: 4,
      subType: [],
    },
  ],
};

// Positive test case
describe("Positive test case", () => {
  describe("convert CategoryProps to CategoryTreeProps", () => {
    it("should return the correct CategoryTreeProps", () => {
      const result = convertCategoryPropsToTree(props);
      expect(result).toEqual(expected);
    });
    it("should skip improper parents", () => {
      const result = convertCategoryPropsToTree(cases.improperParents);
      expect(result).toEqual(expects.improperParents);
    });
  });
});

// Edge test case
describe("Edge test case", () => {
  describe("convert CategoryProps to CategoryTreeProps", () => {
    it("should return an empty array when given an empty array", () => {
      const props: any = [];
      const result = convertCategoryPropsToTree(props);
      expect(result).toEqual([]);
    });
  });
});
