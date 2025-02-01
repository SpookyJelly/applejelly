/**
 *
 * Calendar
 *
 */

import React, { useState } from 'react'
import {
    addDays,
    isSaturday,
    isSunday,
    lastDayOfMonth,
    startOfMonth,
    format,
    isThisMonth,
    addMonths,
    subMonths,
    isSameMonth,
    subYears,
    addYears,
    startOfYear,
    endOfYear,
    isWithinInterval,
    isValid,
    subDays,
    addSeconds,
    subSeconds,
    isSameDay,
    getDate,
    startOfDay,
    endOfDay,
    getUnixTime,
    toDate,
    isBefore,
    max,
    min,
    isAfter,
    endOfMonth,
} from 'date-fns'
import * as R from 'ramda'
import Button from '../../form/Button'
import Icon from '../../common/Icon'
import cn from 'classnames'
import './calendar.scss'

type RangeState = 'empty' | 'selecting' | 'full' | 'none' | 'selecting hover'
type StyleType = {}

const BLOCK = 'AJ-time_calendar'
// styles

const Wrapper = ({
    children,
    className,
    ...rest
}: React.HTMLProps<HTMLDivElement>) => {
    return (
        <div className={cn(BLOCK + '__wrapper', className)} {...rest}>
            {children}
        </div>
    )
}
const Navigation = ({ children, ...rest }: React.HTMLProps<HTMLDivElement>) => {
    return (
        <div className={cn(BLOCK + '__navigation')} {...rest}>
            {children}
        </div>
    )
}
const YearView = ({
    children,
    className,
    ...rest
}: React.HTMLProps<HTMLDivElement>) => {
    return (
        <div className={cn(BLOCK + '__year-view', className)} {...rest}>
            {children}
        </div>
    )
}

const MonthButton = ({
    children,
    className,
    ...rest
}: React.HTMLProps<HTMLButtonElement>) => {
    return (
        //@ts-ignore
        <button className={cn(BLOCK + '__month-button', className)} {...rest}>
            {children}
        </button>
    )
}

function getDaysInMonth(date: Date, arr: Date[]) {
    if (lastDayOfMonth(date) > date) {
        return getDaysInMonth(addDays(date, 1), [...arr, date])
    }
    return [...arr, date]
}

function getMonthsInYear(date: Date) {
    const init = startOfYear(date)
    return [init, ...R.times((i) => addMonths(init, i + 1), 11)]
}
/**
 * 현재 달에 이웃한 날짜들을 구하는 함수 (달력에 표시될)
 * @param Date[] (이번 달 날짜)
 * @returns Date[] (전달, 다음 달 날짜 일부가 포함된)
 */
function getNeighboringDates(dates: Date[]) {
    const firstDate = R.head(dates)!
    const lastDate = R.last(dates)!

    // TODO:설정에 따라서 isSunday, isMonday 등으로 변경 가능하게
    if (!isSunday(firstDate)) {
        return getNeighboringDates([addDays(firstDate, -1), ...dates])
    }
    if (!isSaturday(lastDate)) {
        return getNeighboringDates([...dates, addDays(lastDate, 1)])
    }
    return dates
}
function sortDateArray(dateArray: Date[]) {
    return R.sort((a: Date, b: Date) => a.getTime() - b.getTime(), dateArray)
}
function isDateBetween(dateArray: Array<Date>, targetDate: Date) {
    if (dateArray.length !== 2 || isSameDay(dateArray[0], dateArray[1]))
        return false
    const sortedDateArray = sortDateArray(dateArray)

    const [startDate, endDate] = sortedDateArray
    return isWithinInterval(targetDate, {
        start: startDate,
        end: endDate,
    })
}
function toggleFromArray<T>(dateArray: T[], date: T) {
    return R.ifElse(
        R.includes(date),
        R.filter((d: T) => !R.equals(d, date)),
        R.append(date)
    )(dateArray) as T[]
}
function getQueueState(queueLength: number) {
    return R.cond([
        [R.equals(0), R.always('empty')],
        [R.equals(1), R.always('selecting')],
        [R.equals(2), R.always('full')],
        [R.T, R.always('none')],
    ])(queueLength)
}
function getClassNameByRangeState(
    date: Date,
    currentDate: Date,
    selectedDates: Date[],
    queueState: RangeState,
    hoverDate: Date | undefined
) {
    const sortedSelectedDate = sortDateArray(selectedDates)

    const compareDates = (function (
        hoverDate: Date | undefined,
        selectedDates: Date[],
        queueState: RangeState
    ) {
        if (queueState === 'full') return selectedDates
        if (hoverDate && isBefore(hoverDate, max(selectedDates))) {
            return [max(selectedDates)]
        }
        return [min(selectedDates)]
    })(hoverDate, selectedDates, queueState)

    const monthFns = [
        R.ifElse(
            () => isSameMonth(date, currentDate),
            R.always('sameMonth'),
            R.always('neighbor')
        ),
        R.ifElse(
            () =>
                R.any(
                    (d) => R.equals(startOfDay(d), startOfDay(date)),
                    compareDates
                ),
            R.always('tile-active'),
            R.always('')
        ),
    ]
    const hoverFns = [
        R.ifElse(
            () =>
                (queueState === 'full' || queueState === 'selecting hover') &&
                R.all((x: Date) => {
                    return !isSameDay(x, date)
                })(sortedSelectedDate) &&
                isDateBetween(
                    [
                        startOfDay(sortedSelectedDate[0]),
                        endOfDay(sortedSelectedDate[1]),
                    ],
                    date
                ),
            R.always('in-range'),
            R.always('')
        ),
    ]
    return R.pipe(
        R.map((fn: Function) => fn()),
        R.join(' ')
    )([...monthFns, ...hoverFns])
}

function Calendar({
    maxDate,
    minDate,
    canSelectMonth,
    onChange,
    dates,
    as,
    limit,
    border,
    className,
    ...rest
}: Props) {
    const transformDates = R.pipe(
        // Date인 경우 배열로 변환
        R.when(R.is(Date), (date: Date) => [date]),
        // 이미 배열인 경우 그대로 반환
        R.when(R.is(Array), R.identity),
        // undefined인 경우 빈 배열로 변환
        R.defaultTo([]),
        // 같은 날짜 필터링 ++ 같은 날
        R.uniqBy(toDate),
        R.sortWith([R.ascend(getUnixTime)]),
        (dates) => limitDates(dates)
    ) as (data: Props['dates']) => Date[]
    const limitDates = (dates: any) => {
        let cpDates = dates
        const { max, min } = limit || {} // Add type guard to handle undefined limit object
        if (max && isAfter(dates[1], max)) cpDates[1] = max
        if (min && isBefore(dates[0], min)) cpDates[0] = min
        return cpDates
    }

    const [currentDate, setCurrentDate] = useState(new Date()) // 활성화된 날짜랑은 다르게 가져간다
    const [isMonthView, setIsMonthView] = useState(true) //

    const [selectedDates, setSelectedDates] = useState<Date[]>(
        transformDates(dates)
    )
    const canSelectRange =
        transformDates(dates).length >= 2 || rest.canSelectRange
    const [hoverDate, setHoverDate] = useState<Date>()

    const queueState = R.pipe(getQueueState, (state) =>
        hoverDate && state === 'selecting' ? state + ' hover' : state
    )(selectedDates.length) as RangeState

    React.useEffect(() => {
        if (queueState === 'full')
            onChange([selectedDates[0], selectedDates[1]])
        else onChange(selectedDates[0])
    }, [selectedDates])

    const activatedDates =
        queueState === 'full'
            ? selectedDates
            : (R.filter((e) => isValid(e))([
                  ...selectedDates,
                  hoverDate,
              ]) as Date[])

    const days = ['일', '월', '화', '수', '목', '금', '토']

    const arrowBtnHandler = (e: React.MouseEvent, type: string) => {
        switch (type) {
            case 'next':
                const plusDate = isMonthView
                    ? addMonths(currentDate, 1)
                    : endOfYear(addYears(currentDate, 1))
                setCurrentDate(plusDate)
                return
            case 'prev':
                const subDate = isMonthView
                    ? subMonths(currentDate, 1)
                    : startOfYear(subYears(currentDate, 1))
                setCurrentDate(subDate)
                return
            default:
                break
        }
    }

    const calendarDays = React.useMemo(() => {
        const monthDays = getDaysInMonth(startOfMonth(currentDate), [])
        return getNeighboringDates(monthDays)
    }, [currentDate])

    //NOTE : refactor this function after confirmed
    const isDisabled = (date: Date) =>
        (limit?.max && isAfter(date, startOfDay(limit.max))) ||
        (limit?.min && isBefore(date, startOfDay(limit.min)))
    const getHandler = (isRangeMode: boolean, rangeState: RangeState) => {
        if (isRangeMode) {
            return {
                onClick: (date: Date) => {
                    const value =
                        rangeState === 'full'
                            ? [date]
                            : toggleFromArray(selectedDates, date)
                    const result = R.sortWith<Date>([R.ascend(getUnixTime)])(
                        value
                    )
                    setSelectedDates(result)
                    setHoverDate(undefined)
                },
                onMouseOver: (date: Date) =>
                    rangeState.includes('selecting') && setHoverDate(date),
                onMouseLeave: (date: Date) =>
                    rangeState.includes('selecting') && setHoverDate(undefined),
            }
        }
        return {
            onClick: (date: Date) => {
                setSelectedDates([date])
            },
            onMouseOver: (date: Date) => {},
            onMouseLeave: (date: Date) => {},
        }
    }

    const handlers = getHandler(canSelectRange, queueState)

    return (
        <Wrapper className={cn({ '--border': border }, className)} {...rest}>
            <Navigation>
                <Button
                    icon="arrowLeft"
                    className={cn(BLOCK, '__arrow-button', '__hover-bg', {
                        '--visible': currentDate >= minDate,
                    })}
                    onClick={(e) => arrowBtnHandler(e, 'prev')}
                    isDisabled={
                        currentDate <= minDate ||
                        (limit?.min &&
                            isBefore(startOfMonth(currentDate), limit.min))
                    }
                />
                <MonthButton
                    onClick={() => {
                        if (canSelectMonth) setIsMonthView(false)
                    }}
                >
                    <div
                        className={cn('time-calendar', {
                            [BLOCK + '__hover-bg']:
                                canSelectMonth && isMonthView,
                        })}
                    >
                        <strong>
                            {isMonthView
                                ? format(currentDate, 'MMMM yyyy')
                                : format(currentDate, 'yyyy')}
                        </strong>
                        {canSelectMonth && isMonthView && (
                            <Icon name="caretDown" color="black" size="md" />
                        )}
                    </div>
                </MonthButton>
                <Button
                    icon="arrowRight"
                    className={cn(BLOCK, '__arrow-button', '__hover-bg', {
                        '--visible': maxDate >= currentDate,
                        '--hidden': maxDate < currentDate,
                    })}
                    isDisabled={
                        maxDate <= currentDate ||
                        (limit?.max &&
                            isAfter(endOfMonth(currentDate), limit?.max))
                    }
                    onClick={(e) => arrowBtnHandler(e, 'next')}
                />
            </Navigation>
            <div
                className={cn(BLOCK + '__month-view', {
                    '--block': isMonthView,
                    '--none': !isMonthView,
                })}
            >
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%' }}>
                        <div className="weekdays">
                            {days.map((day) => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>
                        <div className="viewdays">
                            {calendarDays.map((date, i) => {
                                return (
                                    <Button
                                        key={i}
                                        className={cn(
                                            getClassNameByRangeState(
                                                date,
                                                currentDate,
                                                activatedDates,
                                                queueState,
                                                hoverDate
                                            ),
                                            BLOCK,
                                            '__tile-button'
                                        )}
                                        data-column="7"
                                        onClick={() =>
                                            !isDisabled(date) &&
                                            handlers.onClick(date)
                                        }
                                        onMouseOver={() =>
                                            !isDisabled(date) &&
                                            handlers.onMouseOver(date)
                                        }
                                        onMouseLeave={() =>
                                            !isDisabled(date) &&
                                            handlers.onMouseLeave(date)
                                        }
                                        isDisabled={isDisabled(date)}
                                    >
                                        <abbr
                                            aria-label={format(
                                                date,
                                                'yyyy-MM-dd'
                                            )}
                                        >
                                            {date.getDate()}
                                        </abbr>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <YearView
                className={cn({
                    '--block': !isMonthView,
                    '--none': isMonthView,
                })}
            >
                <div className="viewmonths">
                    {getMonthsInYear(currentDate).map((month, i) => {
                        return (
                            <Button
                                key={i}
                                className={cn(BLOCK, '__tile-button', {
                                    active: true,
                                })}
                                data-column="3"
                                isDisabled={
                                    (limit?.max &&
                                        isAfter(
                                            month,
                                            startOfMonth(limit.max)
                                        )) ||
                                    (limit?.min &&
                                        isBefore(
                                            month,
                                            startOfMonth(limit.min)
                                        ))
                                }
                                onClick={() => {
                                    setCurrentDate(month)
                                    setIsMonthView(true)
                                }}
                            >
                                <abbr>{format(month, 'M월')}</abbr>
                            </Button>
                        )
                    })}
                </div>
            </YearView>
        </Wrapper>
    )
}

Calendar.defaultProps = {
    maxDate: addYears(new Date(), 1),
    minDate: subYears(new Date(), 1),
    onChange: () => {},
    canSelectMonth: false,
    canSelectRange: false,
}

// orign interface Props
interface Props
    extends Omit<
        React.DetailedHTMLProps<
            React.HTMLProps<HTMLDivElement>,
            HTMLDivElement
        >,
        'onChange'
    > {
    dates?: Date | [Date, Date] // Seleted date (or range of dates)
    maxDate: Date // Limit selectable dates to this or earlier
    minDate: Date // Limit selectable dates to this or later
    canSelectMonth: boolean
    canSelectRange: boolean
    onChange: (value: Date | [Date, Date]) => void
    className?: string
    style?: React.CSSProperties
    limit?: {
        max?: Date
        min?: Date
    }
    border?: boolean
}

export type { Props as CalendarProps }
export default Calendar
