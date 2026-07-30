import type { event } from '@/types/event';
import type { patrol } from '@/types/patrol';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarEvent from '@/components/calendar/CalendarEvent';
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
  const { username } = useAuth();

  const userPatrol = patrols?.find(p => isUserSelf(p.member, username));
  const selectedPatrol = patrols?.find(p => p.id === selectedPatrolId);

  function createEvent() {
    Alert.alert(
      'Not implemented yet',
      'Use the website to create events.',
    );
  }

  function createPatrol() {
    setSelectedPatrolDate(dateID);
    setSelectedPatrolId(-1);
  }

  function editPatrol(patrol) {
    console.log('editPatrol', patrol);
    setSelectedPatrolId(patrol.id);
    setSelectedPatrolDate(dateID);
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
          <CalendarEvent event={event} key={event.id} />
        ))}

        <Text style={[elements.mediumText, styles.sectionHeader]}>
          {patrols?.length ? 'Patrols:' : 'No patrols for this day.'}
        </Text>
        {patrols?.map(patrol => (
          <CalendarPatrol patrol={patrol} key={patrol.id} onEditPress={editPatrol.bind(null, patrol)} />
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
            onPress={editPatrol.bind(null, userPatrol)}
          >
            <Text style={[elements.whiteButtonText, styles.bottomButtonText]}>
              Edit Patrol
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  common: {
    fontStyle: 'italic',
    textAlign: 'center',
    borderRadius: 10,
    backgroundColor: '#68a0cf',
    margin: 1,
  },
  event: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  patrol: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomButtonText: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
});

export default CalendarDayModal;
