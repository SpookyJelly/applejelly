import { useLayoutEffect } from 'react'

const SCROLL_LOCKED_PADDING = "--applied-locked-padding";
const scrollPositionSet = new Set();
let bodyOverflow = "";
let bodyPaddingRight = "";
let scrollTop = 0;
let scrollLeft = 0;
const PORTAL_ID = 'daim_portal'

const scrollToOriginalPosition = () => {
  document.scrollingElement?.scrollTo({ top: scrollTop, left: scrollLeft });
};

export const useControlScrollAndStyles = (isLocked, options = {}) => {
  const { shouldRestoreScrollPosition = true } = options;

  useLayoutEffect(() => {
    if (isLocked) {
      const isAlreadyLocked = scrollPositionSet.size !== 0;
      const scrollLockObject = {};

      scrollPositionSet.add(scrollLockObject);

      if (!isAlreadyLocked) {
        bodyOverflow = document.body.style.overflow;
        bodyPaddingRight = document.body.style.paddingRight;
        scrollTop = document.scrollingElement?.scrollTop || 0;
        scrollLeft = document.scrollingElement?.scrollLeft || 0;
        document.body.style.overflow = "hidden";

        if (document.body.offsetHeight > window.innerHeight) {
          const customScrollbarWidth = "calc(" + window.getComputedStyle(document.body).paddingRight + " + var(--custom-scrollbars-width))";
          document.body.style.paddingRight = customScrollbarWidth;
          document.getElementById(PORTAL_ID)?.style.setProperty(SCROLL_LOCKED_PADDING, customScrollbarWidth);
          scrollToOriginalPosition();
        }
      }

      return () => {
        scrollPositionSet.delete(scrollLockObject);

        if (scrollPositionSet.size === 0) {
          document.body.style.overflow = bodyOverflow;
          document.body.style.paddingRight = bodyPaddingRight;
          document.getElementById(PORTAL_ID)?.style.removeProperty(SCROLL_LOCKED_PADDING);

          if (shouldRestoreScrollPosition) {
            scrollToOriginalPosition();
          }

          bodyOverflow = "";
          bodyPaddingRight = "";
          scrollTop = 0;
          scrollLeft = 0;
        }
      };
    }
  }, [isLocked, shouldRestoreScrollPosition]);
};
