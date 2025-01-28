const SCROLLBAR_CHECKER_ID = "scrollbarChecker";
let scrollbarCheckerElement: HTMLElement | null = null;

export const calculateScrollbarWidth = function() {
  if (!scrollbarCheckerElement) {
    let existingElement = document.getElementById(SCROLLBAR_CHECKER_ID);
    scrollbarCheckerElement = existingElement || document.createElement("div");

    if (!existingElement) {
      scrollbarCheckerElement.setAttribute("id", SCROLLBAR_CHECKER_ID);
      scrollbarCheckerElement.style.cssText = `
        overflow-y: scroll;
        width: 50px;
        height: 50px;
        position: absolute;
        clip: rect(0, 0, 0, 0);
        top: 0;
        left: 0;
        visibility: hidden;
      `;
      document.body.appendChild(scrollbarCheckerElement);
    }
  }

  const realWidth = scrollbarCheckerElement.offsetWidth - scrollbarCheckerElement.clientWidth
  return Math.max(0, realWidth);
};
