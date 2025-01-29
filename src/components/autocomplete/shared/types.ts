import React from "react";
interface AutocompleteProps extends React.HTMLAttributes<HTMLDivElement> {
  isMultiline?: boolean;
  validationMessage?: string;
  validationPlacement?: "inline" | "block";
  isReadOnly?: boolean;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  hasGuide?: boolean;
  hasCheckIcon?: boolean;
  hasDetail?: boolean;
  isSingle: boolean;

  // self defined props
  inputOverflowType?: "ellipsis" | "scroll";
  creatable?: boolean;
  hasClearButton?: boolean;
  overflowerType: "gradient" | "ellipsis";
}

export default AutocompleteProps;

export interface PanelValue {
  index: number;
  selectedItem: {
    type?: string;
    count?: number;
    [key: string]: any;
  };
}
export type PanelGroup = "type" | "subType" | "value";
export interface PanelState {
  type: PanelValue;
  subType: PanelValue;
  activatedPanel: PanelGroup;
}

export const PanelActionTypes = {
  UPDATE: {
    TYPE: "updateType",
    SUBTYPE: "updateSubType",
  },
  STEP: {
    TYPE: "panelType",
    SUBTYPE: "panelSubType",
    VALUE: "panelValue",
  },
  CLEAR: "clear",
} as const;

export interface PanelAction {
  type:
    | "updateType"
    | "updateSubType"
    | "clear"
    | "panelType"
    | "panelSubType"
    | "panelValue";
  payload?: Partial<PanelValue>;
}
