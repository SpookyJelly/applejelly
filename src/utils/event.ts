const eventTarget: EventTarget = new EventTarget();

export const dispatchCustomEvent = function(
  eventName: string,
  detail?: any
): void {
  const customEvent: CustomEvent = new CustomEvent(eventName, { detail });
  eventTarget.dispatchEvent(customEvent);
};

export const addCustomEventListener = function(
  eventName: string,
  listener: EventListenerOrEventListenerObject
): void {
  eventTarget.addEventListener(eventName, listener);
};

export const removeCustomEventListener = function(
  eventName: string,
  listener: EventListenerOrEventListenerObject
): void {
  eventTarget.removeEventListener(eventName, listener);
};
