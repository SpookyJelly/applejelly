
const reactElementSymbol = Symbol.for("react.element")
const reactPortalSymbol = Symbol.for("react.portal")
const reactFragmentSymbol = Symbol.for("react.fragment")
const reactStrictModeSymbol = Symbol.for("react.strict_mode")
const reactProfilerSymbol = Symbol.for("react.profiler")
const reactProviderSymbol = Symbol.for("react.provider")
const reactContextSymbol = Symbol.for("react.context")
const reactServerContextSymbol = Symbol.for("react.server_context")
const reactForwardRefSymbol = Symbol.for("react.forward_ref")
const reactSuspenseSymbol = Symbol.for("react.suspense")
const reactSuspenseListSymbol = Symbol.for("react.suspense_list")
const reactMemoSymbol = Symbol.for("react.memo")
const reactLazySymbol = Symbol.for("react.lazy")
const reactOffscreenSymbol = Symbol.for("react.offscreen")

function identifyReactElementType(element) {
  if (typeof element === "object" && element !== null) {
    const elementTypeSymbol = element.$$typeof;
    switch (elementTypeSymbol) {
      case reactElementSymbol:
        const elementType = element.type;
        switch (elementType) {
          case reactFragmentSymbol:
          case reactProfilerSymbol:
          case reactStrictModeSymbol:
          case reactSuspenseSymbol:
          case reactSuspenseListSymbol:
            return elementType;
          default:
            const innerTypeSymbol = elementType && elementType.$$typeof;
            switch (innerTypeSymbol) {
              case reactServerContextSymbol:
              case reactContextSymbol:
              case reactForwardRefSymbol:
              case reactLazySymbol:
              case reactMemoSymbol:
              case reactProviderSymbol:
                return innerTypeSymbol;
              default:
                return elementTypeSymbol;
            }
        }
      case reactPortalSymbol:
        return elementTypeSymbol;
    }
  }
}

const reactModuleReferenceSymbol = Symbol.for("react.module.reference");

export const isForwardRef = (element) => {
  return identifyReactElementType(element) === reactForwardRefSymbol;
};
