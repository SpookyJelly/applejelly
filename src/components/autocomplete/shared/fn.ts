import * as R from "ramda";
import { Item } from "../shared/data";
import { PanelState } from "../shared/types";

export function getFilteredItems(
  fullItems: Item[],
  inputValue: string,
  creatable: boolean,
  fakePanelState: PanelState,
): Item[] {
  const subjectFiltered = getSubjectFilteredItems(fullItems, fakePanelState);
  const inputFiltered = getInputFilteredItems(
    subjectFiltered,
    inputValue,
    // creatable,
  );
  if (creatable && inputFiltered.length === 0 && inputValue !== "") {
    return appendCreatedItem(inputFiltered, inputValue);
  }
  return inputFiltered;
}

export function getUpdatedList(list: Item[], item: Item) {
  return R.ifElse(R.includes(item), R.without([item]), R.append(item))(list);
}

export function getSubjectFilteredItems(
  fullItems: Item[],
  fakePanelState: PanelState,
) {
  const type = R.prop("type", fakePanelState.type.selectedItem);
  const subType = R.prop("value", fakePanelState.subType.selectedItem);
  const filterFn = (elem: any, parm: string | undefined, path: string[]) => {
    if (!parm) return true;
    return R.path(path, elem) === parm;
  };
  const result = R.pipe(
    R.filter((elem) => filterFn(elem, type, ["type"])),
    R.filter((elem) => filterFn(elem, subType, ["subType"])),
  )(fullItems);
  return result;
}

export function getInputFilteredItems(fullItems: Item[], inputValue: string) {
  return R.pipe(
    R.filter((item: Item) =>
      item.value.toLowerCase().includes(inputValue.toLowerCase()),
    ),
    R.map((x) => x),
  )(fullItems);
}

export const appendCreatedItem = (items: Item[], inputValue: string) => {
  const createdItem: Item = { value: inputValue, type: "created", subType: "" };
  return R.append(createdItem, items);
};
