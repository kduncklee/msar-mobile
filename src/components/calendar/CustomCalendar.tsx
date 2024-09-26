import type { CalendarProps } from '@marceloterreiro/flash-calendar';
import {
  Calendar,
  useCalendar,
} from '@marceloterreiro/flash-calendar';
import { memo } from 'react';
import { uppercaseFirstLetter } from '@marceloterreiro/flash-calendar/src/helpers/strings';
import { CustomCalendarItemDay } from './CustomCalendarItemDay';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';

interface CustomCalendarProps extends CalendarProps {
  events: Map<string, event[]>;
  patrols: Map<string, patrol[]>;
}

export const CustomCalendar = memo(
  ({
    events,
    patrols,
    onCalendarDayPress,
    calendarRowVerticalSpacing = 8,
    calendarRowHorizontalSpacing = 8,
    theme,
    calendarDayHeight = 48,
    calendarMonthHeaderHeight = 20,
    calendarWeekHeaderHeight = calendarDayHeight,

    ...buildCalendarParams
  }: CustomCalendarProps) => {
    const { calendarRowMonth, weeksList, weekDaysList }
      = useCalendar(buildCalendarParams);

    return (
      <Calendar.VStack alignItems="center" spacing={calendarRowVerticalSpacing}>
        <Calendar.Row.Month
          height={calendarMonthHeaderHeight}
          theme={theme?.rowMonth}
        >
          {uppercaseFirstLetter(calendarRowMonth)}
        </Calendar.Row.Month>
        <Calendar.Row.Week spacing={8} theme={theme?.rowWeek}>
          {weekDaysList.map((weekDay, i) => (
            <Calendar.Item.WeekName
              height={calendarWeekHeaderHeight}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              theme={theme?.itemWeekName}
            >
              {weekDay}
            </Calendar.Item.WeekName>
          ))}
        </Calendar.Row.Week>
        {weeksList.map((week, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Calendar.Row.Week key={index}>
            {week.map((dayProps) => {
              if (dayProps.isDifferentMonth) {
                return (
                  <Calendar.Item.Day.Container
                    dayHeight={calendarDayHeight}
                    daySpacing={calendarRowHorizontalSpacing}
                    isStartOfWeek={dayProps.isStartOfWeek}
                    key={dayProps.id}
                    theme={theme?.itemDayContainer}
                  >
                    <Calendar.Item.Empty
                      height={calendarDayHeight}
                      theme={theme?.itemEmpty}
                    />
                  </Calendar.Item.Day.Container>
                );
              }

              return (
                <CustomCalendarItemDay
                  containerTheme={theme?.itemDayContainer}
                  theme={theme?.itemDay}
                  dayHeight={calendarDayHeight}
                  daySpacing={calendarRowHorizontalSpacing}
                  key={dayProps.id}
                  metadata={dayProps}
                  onPress={onCalendarDayPress}
                  events={events[dayProps.id]}
                  patrols={patrols[dayProps.id]}
                >
                  {dayProps.displayLabel}
                </CustomCalendarItemDay>
              );
            })}
          </Calendar.Row.Week>
        ))}
      </Calendar.VStack>
    );
  },
);

export default CustomCalendar;
