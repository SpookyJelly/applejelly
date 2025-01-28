import { memoize } from "lodash"
import { format } from "date-fns"

export const timeFormats = {
  EXTRA_SMALL: "h:mm a",
  SMALL: "MMM d, h:mm a",
  SMALL_WITH_SECONDS: "MMM d, h:mm:ss a",
  MEDIUM: "dd, MMM d, h:mm:ss a",
  LARGE: "MMM d, yyyy, h:mm a",
  LARGE_WITHOUT_TIME: "MMM dd, yyyy",
  EXTRA_LARGE: "dd, MMM d, yyyy, h:mm:ss a",
  EXTRA_LARGE_HUMAN: "MMM dd, yyyy 'at' HH:mm:ss.SS",
  SMALL_TABULAR: "MMM dd HH:mm:ss.SS",
  SMALL_WITHOUT_MS_TABULAR: "MM-dd HH:mm:ss",
  LARGE_TABULAR: "MMM dd yyyy HH:mm",
  LARGE_WITHOUT_TIME_TABULAR: "MMM dd yyyy",
  SIMPLE: "HH:mm:ss",
}

export const getDateTimeFormatter = memoize(
  function(locale, options) {
    return new Intl.DateTimeFormat(locale, options);
  },
  function(locale, options) {
    return JSON.stringify({
      locales: locale,
      options: options ? JSON.stringify(options, Object.keys(options).sort()) : '{}'
    });
  }
);

export const defaultTimeZone = getDateTimeFormatter().resolvedOptions().timeZone

export function parseDate(
  time,
  timezone,
  use12HourFormat = false
) {

  try {
    const date = new Date(time);
    const dateTimeFormatter = getDateTimeFormatter("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: use12HourFormat,
      timeZone: timezone
    });

    const parts = dateTimeFormatter.formatToParts(date);
    const result = {
      year: NaN,
      month: NaN,
      day: NaN,
      hours: NaN,
      minutes: NaN,
      seconds: NaN,
      milliseconds: date.getMilliseconds()
    };

    for (const part of parts) {
      const value = parseInt(part.value, 10);
      switch (part.type) {
        case "year":
        case "day":
          result[part.type] = value;
          break;
        case "month":
          result.month = value - 1;
          break;
        case "hour":
          result.hours = value;
          if (value === 24) result.hours = 0;
          break;
        case "minute":
          result.minutes = value;
          break;
        case "second":
          result.seconds = value;
          break;
        case "dayPeriod":
          if (use12HourFormat) {
            result.isPM = part.value === "PM";
            result.isAM = part.value === "AM";
          }
          break;
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

export function formatDateTime(
  time,
  timeFormat,
  timeZone,
  use12HourFormat = false
) {
  const parsedDate = parseDate(
    time,
    timeZone != null ? timeZone : defaultTimeZone,
    use12HourFormat
  );
  if (!parsedDate) return "";

  const {
    year,
    month = 0,
    day = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0
  } = parsedDate;

  const date = new Date(
    year, month, day, hours,
    minutes, seconds, milliseconds
  );
  return format(date, timeFormat);
}
