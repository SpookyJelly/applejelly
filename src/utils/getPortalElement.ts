let portalElement: HTMLElement | undefined;
const PORTAL_ID: string = "daim_portal";

export const getPortalElement = (): HTMLElement => {
  if (!portalElement || !portalElement.parentElement) {
    portalElement = document.getElementById(PORTAL_ID) as HTMLElement;

    if (!portalElement) {
      const element: HTMLElement = document.createElement("div");
      element.id = PORTAL_ID;
      document.body.appendChild(element);
      portalElement = element;
    }
  }

  return portalElement;
};
