import React, { useMemo, useEffect } from 'react'
import { useSafeState, useUpdatableState } from './hooks'
import { useFeature } from '../context'

const zIndexValues = {
  contentHeader: 90,
  navBackground: 100,
  sidePanel: 210,
  navBackgroundActive: 300,
  navSubmenu: 310,
  popover: 1000,
  top: 10000
};
let count = 0
const createNewMap = () => new Map
const noop = () => {}
const elevationGroups = { [String('')]: createNewMap() }

export function useElevation(props: Props) {
  const {
    isEnabled,
    customElevationGroup = '',
    stack,
    legacyElevation
  } = props;

  const { name, size = 0 } = stack || {};
  const isFeatureEnabled = useFeature("z-index-elevation-hook");
  const [isElevationEnabled, setIsElevationEnabled] = useUpdatableState(isEnabled && isFeatureEnabled);
  const [computedZIndex, setComputedZIndex] = useSafeState();
  const shouldComputeElevation = isEnabled || isElevationEnabled;
  const elevationId = useMemo(() => shouldComputeElevation ? count++ : undefined, [shouldComputeElevation]);

  useEffect(() => {
    if (isElevationEnabled && elevationId !== undefined) {
      const mapKey = {}
      const baseZIndex = legacyElevation ? zIndexValues[legacyElevation] : 100;
      let elevationGroup = elevationGroups[customElevationGroup];

      if (!elevationGroup) {
        elevationGroup = createNewMap();
        elevationGroups[customElevationGroup] = elevationGroup;
      }

      const encounteredStacks = new Set();
      let elevationValue, isCurrentStack = false;
      const stacks = []
      for (const item of elevationGroup.values()) {
        const { mountCount, stackName, elevation } = item;
        if (!(mountCount >= elevationId)) {
          if (stackName) {
            if (stackName === name) {
              elevationValue = elevation
              isCurrentStack = true
              break
            }
            if (encounteredStacks.has(stackName)) continue;
            encounteredStacks.add(stackName)
          }
          stacks.push(item)
        }
      }

      if (!isCurrentStack) {
        const lastStack = stacks.at(-1)
        elevationValue = (lastStack === null || lastStack === undefined) ? undefined : lastStack.elevation
      }

      const maxElevation = elevationValue != null ? elevationValue : -1 // null && undefined
      const calculatedElevation = isCurrentStack ? elevationValue : Math.max(maxElevation + 1, baseZIndex) + size;

      elevationGroup.set(mapKey, {
        elevation: calculatedElevation,
        mountCount: elevationId,
        stackName: name
      });
      setComputedZIndex(calculatedElevation - size);

      return () => {
        setComputedZIndex(undefined);
        elevationGroup.delete(mapKey);
      }
    }
  }, [
    isElevationEnabled,
    legacyElevation,
    elevationId,
    setComputedZIndex,
    customElevationGroup,
    name,
    size
  ]);



  return {
    style: computedZIndex ? { zIndex: computedZIndex } : undefined,
    setIsEnabled: isFeatureEnabled ? setIsElevationEnabled : noop
  };
};

useElevation.defaultProps = {
  customElevationGroup: '',
  isEnabled: true
}

interface Props {
  isEnabled: boolean
  customElevationGroup?: string
  stack?: {name: string, size: number }
  legacyElevation?: keyof typeof zIndexValues
}


