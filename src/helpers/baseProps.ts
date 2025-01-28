import * as R from 'ramda'
import type { SPACING_SIZE } from './constant'

export const marginPropList = ["marginX", "marginY", "margin", "marginLeft", "marginTop", "marginRight", "marginBottom"] as const;
export const paddingPropList = ["paddingX", "paddingY", "padding", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom"] as const;
export const lockupPropList = ["hasLeftLockup", "hasRightLockup", "hasTopLockup", "hasBottomLockup", "hasFullLockup"] as const;
export const extraDomList = ['ariaAttrs', 'dataAttrs'] as const
export const customColorList = ['textColor', 'backgroundColor'] as const

const baseProps = {
  margin: marginPropList,
  padding: paddingPropList,
  lockups: lockupPropList,
  // customColor: customColorList,
} as const
type BasePropsKey = keyof typeof baseProps
type MarginCommon = SPACING_SIZE | 'auto'


export interface MarginProps {
  marginX?: MarginCommon;
  marginY?: MarginCommon;
  margin?: MarginCommon;
  marginLeft?: MarginCommon;
  marginTop?: MarginCommon;
  marginRight?: MarginCommon;
  marginBottom?: MarginCommon;
}
export interface PaddingProps {
  paddingX?: MarginCommon;
  paddingY?: MarginCommon;
  padding?: MarginCommon;
  paddingLeft?: MarginCommon;
  paddingTop?: MarginCommon;
  paddingRight?: MarginCommon;
  paddingBottom?: MarginCommon;
}
export interface LockupProps {
  hasLeftLockup?: boolean;
  hasRightLockup?: boolean;
  hasTopLockup?: boolean;
  hasBottomLockup?: boolean;
  hasFullLockup?: boolean;
}
type Props = Record<string, any>;

export interface BaseProps {
  marginProps: MarginProps;
  paddingProps: PaddingProps;
  lockupProps: LockupProps;
  rest: Props;
}

export const getGroupByCategory = (props: Props): BaseProps => {
  let baseProps: any = { marginProps: {}, paddingProps: {}, lockupProps: {}, rest: {} };

  Object.keys(props).forEach((prop: any) => {
    if (marginPropList.includes(prop)) {
      baseProps.marginProps[prop] = props[prop];
    } else if (paddingPropList.includes(prop)) {
      baseProps.paddingProps[prop] = props[prop];
    } else if (lockupPropList.includes(prop)) {
      baseProps.lockupProps[prop] = props[prop];
    } else {
      baseProps.rest[prop] = props[prop];
    }
  });

  return baseProps;
}

const rootMap: Record<string, string> = {
  margin: "margin",
  padding: "padding",
  lockups: "lockup"
};



export const omitBaseProps = (props: Props, blacklist: string[])  => {
  const getList = blacklist.reduce((acc: string[], key: string) => {
    return acc.concat(baseProps[key] || [])
  }, [])

  return R.omit(getList, props)
}


export const getBasePropsClassnames = (
  props: Props,
  whitelist: string[]
): Props => {
  const { marginProps, paddingProps, lockupProps } = getGroupByCategory(props);
  let cns: Record<string, string | undefined | boolean> = {};

  if (whitelist.includes("margin")) {
    const rootClass = rootMap.margin;
    const { marginX, marginY, margin, marginLeft, marginTop, marginRight, marginBottom } = marginProps;
    if (margin !== undefined) cns[`${rootClass}--${margin}`] = margin;

    const top = marginTop || marginY,
          bottom = marginBottom || marginY,
          left = marginLeft || marginX,
          right = marginRight || marginX;

    if (top || bottom || left || right) {
      cns[`${rootClass}--top-${top}`] = top;
      cns[`${rootClass}--bottom-${bottom}`] = bottom;
      cns[`${rootClass}--left-${left}`] = left;
      cns[`${rootClass}--right-${right}`] = right;
    }
  }

  if (whitelist.includes("padding")) {
    const rootClass = rootMap.padding;
    const { paddingX, paddingY, padding, paddingLeft, paddingTop, paddingRight, paddingBottom } = paddingProps;
    if (padding !== undefined) cns[`${rootClass}--${padding}`] = padding;

    const top = paddingTop || paddingY,
          bottom = paddingBottom || paddingY,
          left = paddingLeft || paddingX,
          right = paddingRight || paddingX;

    if (top || bottom || left || right) {
      cns[`${rootClass}--top-${top}`] = top;
      cns[`${rootClass}--bottom-${bottom}`] = bottom;
      cns[`${rootClass}--left-${left}`] = left;
      cns[`${rootClass}--right-${right}`] = right;
    }
  }

  if (whitelist.includes("lockups")) {
    const rootClass = rootMap.lockups;
    const { hasLeftLockup, hasRightLockup, hasTopLockup, hasBottomLockup, hasFullLockup } = lockupProps;
    cns[`${rootClass}--left`] = hasLeftLockup || hasFullLockup;
    cns[`${rootClass}--right`] = hasRightLockup || hasFullLockup;
    cns[`${rootClass}--top`] = hasTopLockup || hasFullLockup;
    cns[`${rootClass}--bottom`] = hasBottomLockup || hasFullLockup;
  }

  return cns;
}


export const getBaseProps = (props: Props, list: string[]) => {
  const cns = getBasePropsClassnames(props, list)
  const omitedList = omitBaseProps(props, list)
  return [cns, omitedList]
}
