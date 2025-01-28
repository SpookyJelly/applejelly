import { toUpper } from 'ramda'
import {
  SECOND, MINUTE, HOUR,
  DAY, WEEK, MONTH, YEAR,
  TIME_UNITS_PLURAL,
  TIME_UNITS_SHORT,
  TIME_UNITS_SINGULAR
} from './constants'


function getTimeUnit(time) {
  if (time >= 12 * MONTH) return TIME_UNITS_PLURAL.YEARS;
  if (time >= 4 * MONTH) return TIME_UNITS_PLURAL.MONTHS;

  const remainder = time % WEEK;

  if (time >= WEEK - HOUR && (remainder === 0 || Math.abs(remainder) === HOUR)) {
    return TIME_UNITS_PLURAL.WEEKS;
  }

  if (time >= MONTH) return TIME_UNITS_PLURAL.MONTHS;
  if (time >= DAY) return TIME_UNITS_PLURAL.DAYS;
  if (time >= HOUR) return TIME_UNITS_PLURAL.HOURS;
  if (time >= MINUTE) return TIME_UNITS_PLURAL.MINUTES;
  if (time >= SECOND) return TIME_UNITS_PLURAL.SECONDS;

  return TIME_UNITS_PLURAL.MILLISECONDS;
}

const timeDict = {
  [TIME_UNITS_PLURAL.MILLISECONDS]: 1,
  [TIME_UNITS_PLURAL.SECONDS]: SECOND,
  [TIME_UNITS_PLURAL.MINUTES]: MINUTE,
  [TIME_UNITS_PLURAL.HOURS]: HOUR,
  [TIME_UNITS_PLURAL.DAYS]: DAY,
  [TIME_UNITS_PLURAL.WEEKS]: WEEK,
  [TIME_UNITS_PLURAL.MONTHS]: MONTH,
  [TIME_UNITS_PLURAL.YEARS]: YEAR,
}

export function formatTime(props) {
  const {
    milliseconds,
    isAbbreviated = false
  } = props
  const unit = props.unit || getTimeUnit(milliseconds)
  const roundedValue = Math.round(milliseconds / timeDict[unit])
  const UNIT = toUpper(unit)

  const unitLabel = isAbbreviated ?
    TIME_UNITS_SHORT[UNIT] : roundedValue === 1 ?
      TIME_UNITS_SINGULAR[UNIT] : `${TIME_UNITS_PLURAL[UNIT]}`

  return {
    value: roundedValue,
    unit: unitLabel
  }
}
