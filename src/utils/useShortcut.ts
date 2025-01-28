import { useState, useEffect } from "react";
import { useCurrentRef, useElement } from "./hooks";
import mousetrap from "mousetrap";


class MousetrapExtended extends mousetrap {
  canBypassFocus: boolean;

  constructor(canBypassFocus: boolean, elementReferer: any) {
    super(elementReferer);
    this.canBypassFocus = canBypassFocus;
    this.stopCallback = (key, element, action) => {
      if (!this.canBypassFocus) {
        return super.stopCallback(key, element, action);
      }
      return false;
    }
  }

  destroy(): void {
    this.reset();
  }
}

interface ShortcutOptions {
  canBypassFocus?: boolean;
  elementReferer?: HTMLElement;
  isEnabled?: boolean;
}

export const useShortcut = (
  bindKey: string,
  action: (e: KeyboardEvent) => void,
  options: ShortcutOptions = {}
): void => {
  const { canBypassFocus = false, elementReferer = document, isEnabled = true } = options;
  const [shortcutAction, setShortcutAction] = useState<MousetrapExtended | null>(null);
  const element = useElement(elementReferer);
  const actionRef = useCurrentRef(action);

  useEffect(() => {
    if (isEnabled) {
      const inst = new MousetrapExtended(
        canBypassFocus,
        element || document
      );
      setShortcutAction(inst);
      return () => inst.destroy();
    }
  }, [element, isEnabled, canBypassFocus]);

  useEffect(() => {
    if (shortcutAction && bindKey && isEnabled) {
      shortcutAction.bind(bindKey, (event: KeyboardEvent) => actionRef.current(event))
      return () => shortcutAction.destroy()
    }
  }, [shortcutAction, isEnabled, bindKey, actionRef]);
};



 export const useLongPress = (key, action, cancelAction, isEnabled = true) => {
  if (!isEnabled) return;

  useEffect(() => {
    if (!key || typeof action !== "function" || typeof cancelAction !== "function") {
      console.warn("Key, action, and cancelAction must be provided and valid functions.");
      return;
    }

    mousetrap.bind(key, () => {
      action();
    }, "keydown");

    mousetrap.bind(key, () => {
      cancelAction();
    }, "keyup");

    return () => {
      mousetrap.unbind(key, "keydown");
      mousetrap.unbind(key, "keyup");
    };
  }, [key, action, cancelAction]); // 의존성 배열: key, action, cancelAction
};
