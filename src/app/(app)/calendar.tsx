import type { CalendarTheme } from '@marceloterreiro/flash-calendar';
import { toDateId } from '@marceloterreiro/flash-calendar';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import colors from '@/styles/colors';
import { CustomCalendar } from '@/components/calendar/CustomCalendar';
import { useEventListQuery, usePatrolListQuery } from '@/remote/query';
import CalendarDayModal from '@/components/calendar/CalendarDayModal';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';
import { compareUsername } from '@/types/user';

const linearAccent = '#585ABF';

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      // textAlign: 'left',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '700',
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
      borderStyle: 'solid',
    },
  },
  itemWeekName: { content: { color: 'rgba(255, 255, 255, 0.9)' } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : 'transparent',
        borderRadius: 4,
      },
      content: {
        color: !isWeekend && !isPressed ? 'rgba(255, 255, 255, 0.5)' : '#ffffff',
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: isPressed ? 4 : 30,
        borderWidth: 1,
        backgroundColor: isPressed ? linearAccent : 'transparent',
      },
      content: {
        color: isPressed ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 4 : 0,
        borderBottomLeftRadius: isStartOfRange ? 4 : 0,
        borderTopRightRadius: isEndOfRange ? 4 : 0,
        borderBottomRightRadius: isEndOfRange ? 4 : 0,
      },
      content: {
        color: '#ffffff',
      },
    }),
  },
};

const today = toDateId(new Date());

function Page() {
  const [selectedDate, setSelectedDate] = useState<string>(null);

  const eventQuery = useEventListQuery();
  const events = new Map<string, event[]>();
  if (eventQuery.isSuccess) {
    eventQuery.data.forEach((e) => {
      const dateId = toDateId(e.start_at);
      if (!events[dateId]) {
        events[dateId] = [e];
      }
      else {
        events[dateId].push(e);
      }
    });
  }

  const patrolQuery = usePatrolListQuery();
  const patrols = new Map<string, patrol[]>();
  if (patrolQuery.isSuccess) {
    patrolQuery.data.forEach((p) => {
      const dateId = toDateId(p.start_at);
      if (!patrols[dateId]) {
        patrols[dateId] = [p];
      }
      else {
        patrols[dateId].push(p);
        patrols[dateId].sort(
          (a, b) => {
            console.log(a.member.username, b.member.username);
            return compareUsername(a.member, b.member);
          },
        );
      }
    });
  }

  function onCalendarDayPress(dateId: string) {
    console.log(dateId);
    setSelectedDate(dateId);
  }

  const onClose = () => {
    setSelectedDate(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Calendar" backButton />
      <ScrollView style={styles.scrollView}>
        <CustomCalendar
          calendarMonthId={today}
          events={events}
          patrols={patrols}
          calendarFirstDayOfWeek="monday"
          calendarDayHeight={null}
          theme={linearTheme}
          onCalendarDayPress={onCalendarDayPress}
        />
      </ScrollView>
      {!!selectedDate && (<CalendarDayModal dateID={selectedDate} events={events[selectedDate]} patrols={patrols[selectedDate]} onCancel={onClose} />)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBg,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
    backgroundColor: colors.secondaryBg,
  },

});

export default Page;
