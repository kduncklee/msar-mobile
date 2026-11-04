import type { event } from '@/types/event';
import type { patrol } from '@/types/patrol';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import CalendarEventModal from '@/components/calendar/CalendarEventModal';
import CalendarPatrol from '@/components/calendar/CalendarPatrol';
import CalendarPatrolModal from '@/components/calendar/CalendarPatrolModal';
import ModalFade from '@/components/modals/common/ModalFade';
import useAuth from '@/hooks/useAuth';
import { elements } from '@/styles/elements';
import { isUserSelf } from '@/types/user';

interface CalendarDayModalProps {
  dateID: string;
  events: event[];
  patrols: patrol[];
  onCancel: () => void;
};

function CalendarDayModal({ dateID, events, patrols, onCancel }: CalendarDayModalProps) {
  const [selectedPatrolDate, setSelectedPatrolDate] = useState<string>('');
  const [selectedPatrolId, setSelectedPatrolId] = useState<number>(-1);

  const [selectedEventDate, setSelectedEventDate] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<number>(-1);

  const { username } = useAuth();

  const userPatrol = patrols?.find(p => isUserSelf(p.member, username));
  const selectedPatrol = patrols?.find(p => p.id === selectedPatrolId);
  const selectedEvent = events?.find(e => e.id === selectedEventId);

  function createEvent() {
    setSelectedEventDate(dateID);
    setSelectedEventId(-1);
  }

  function editEvent(eventItem: event) {
    console.log('editEvent', eventItem);
    if (eventItem.id != null) {
      setSelectedEventId(eventItem.id);
      setSelectedEventDate(dateID);
    }
  }

  const closeEventModal = () => {
    setSelectedEventDate('');
    setSelectedEventId(-1);
  };

  function createPatrol() {
    setSelectedPatrolDate(dateID);
    setSelectedPatrolId(-1);
  }

  function editPatrol(patrolItem: patrol) {
    console.log('editPatrol', patrolItem);
    if (patrolItem.id != null) {
      setSelectedPatrolId(patrolItem.id);
      setSelectedPatrolDate(dateID);
    }
  }

  const closePatrolModal = () => {
    setSelectedPatrolDate('');
    setSelectedPatrolId(-1);
  };

  return (
    <ModalFade
      modalVisible={!!dateID}
      onCancel={onCancel}
      headerTitle={dateID}
    >
      <ScrollView style={styles.dataContainer}>

        <Text style={[elements.mediumText, styles.sectionHeader]}>
          {events?.length ? 'Events:' : 'No events for this day.'}
        </Text>
        {events?.map(event => (
          <CalendarEvent event={event} key={event.id} onEditPress={() => editEvent(event)} />
        ))}

        <Text style={[elements.mediumText, styles.sectionHeader]}>
          {patrols?.length ? 'Patrols:' : 'No patrols for this day.'}
        </Text>
        {patrols?.map(patrol => (
          <CalendarPatrol patrol={patrol} key={patrol.id} onEditPress={() => editPatrol(patrol)} />
        ))}

      </ScrollView>
      <View style={elements.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, elements.splitButton]}
          onPress={createEvent}
        >
          <Text style={[elements.whiteButtonText, styles.bottomButtonText]}>
            Create Event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, elements.splitButton]}
          onPress={createPatrol}
        >
          <Text style={[elements.whiteButtonText, styles.bottomButtonText]}>
            Create Patrol
          </Text>
        </TouchableOpacity>
        {userPatrol && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[elements.capsuleButton, elements.splitButton]}
            onPress={() => editPatrol(userPatrol)}
          >
            <Text style={[elements.whiteButtonText, styles.bottomButtonText]}>
              Edit Patrol
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!!selectedEventDate && <CalendarEventModal dateID={selectedEventDate} event={selectedEvent} onCancel={closeEventModal} />}
      {!!selectedPatrolDate && <CalendarPatrolModal dateID={selectedPatrolDate} patrol={selectedPatrol} onCancel={closePatrolModal} />}
    </ModalFade>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    zIndex: 101,
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sectionHeader: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  bottomButtonText: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
});

export default CalendarDayModal;
