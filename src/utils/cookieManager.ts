const genSetCookie= (converter, defaultAttributes) => (name, value, options) => {
  if (typeof document !== "undefined") {
    options = { ...defaultAttributes, ...options };
    if (typeof options.expires === "number") {
      options.expires = new Date(Date.now() + 864e5 * options.expires);
    }
    if (options.expires) {
      options.expires = options.expires.toUTCString();
    }
    name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);

    let cookieString = "";
    for (const key in options) {
      if (options[key]) {
        cookieString += `; ${key}`;
        if (options[key] !== true) {
          cookieString += `=${options[key].split(";")[0]}`;
        }
      }
    }
    document.cookie = name + "=" + converter.write(value, name) + cookieString;
  }
}

const genGetCookie = (converter) => (name?: string): string | {[key: string]: string} | undefined => {
  if (typeof document === "undefined" || (!arguments.length && !name)) {
    return;
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const parsedCookies = cookies.reduce((acc: {[key: string]: string}, cookie) => {
    const parts = cookie.split("=");
    const cookieName = decodeURIComponent(parts.shift()!);
    const cookieValue = parts.join("=");

    try {
      acc[cookieName] = converter.read(cookieValue, cookieName);
    } catch (error) {
      console.error("Error processing cookie:", error);
    }
    return acc;
  }, {});

  return name ? parsedCookies[name] : parsedCookies;
};

const initialConvert =  {
  read(value: string) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write(value: string) {
    return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
  }
}
const initialAttr = { path: "/" }

function initCookieManager(converter, defaultAttributes = {}) {
  const setCookie = genSetCookie(converter, defaultAttributes)
  const getCookie = genGetCookie(converter)

  return Object.create({
    set: setCookie,
    get: getCookie,
    remove(name: string, options = {}) {
      setCookie(name, "", { ...options, expires: -1 });
    },
    withAttributes(attributes = {}) {
      return initCookieManager(converter, { ...defaultAttributes, ...attributes });
    },
    withConverter(newConverter = {}) {
      return initCookieManager({ ...converter, ...newConverter }, defaultAttributes);
    }
  }, {
    attributes: { value: Object.freeze(defaultAttributes) },
    converter: { value: Object.freeze(converter) }
  });
}


export const cookieManager = initCookieManager(initialConvert, initialAttr);
