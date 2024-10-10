import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModalFade from '@/components/modals/common/ModalFade';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import { elements } from '@/styles/elements';
import CalendarPatrol from '@/components/calendar/CalendarPatrol';
import { isUserSelf } from '@/types/user';
import useAuth from '@/hooks/useAuth';
import CalendarPatrolModal from '@/components/calendar/CalendarPatrolModal';

interface CalendarDayModalProps {
  dateID: string;
  events: event[];
  patrols: patrol[];
  onCancel: () => void;
};

function CalendarDayModal({ dateID, events, patrols, onCancel }: CalendarDayModalProps) {
  const [selectedPatrolDate, setSelectedPatrolDate] = useState<string>(null);
  const { username } = useAuth();

  const userPatrol = patrols?.find(p => isUserSelf(p.member, username));
  // patrols?.filter(p => isUserSelf(p.member, username));

  console.log(events, patrols);

  function createEvent() {
    Alert.alert(
      'Not implemented yet',
      'Use the website to create events.',
    );
  }

  function createOrEditPatrol() {
    setSelectedPatrolDate(dateID);
  }

  const closePatrolModal = () => {
    setSelectedPatrolDate(null);
  };

  return (
    <ModalFade
      modalVisible={!!dateID}
      onCancel={onCancel}
      headerTitle={dateID}
    >
      <ScrollView style={styles.dataContainer}>

        <Text style={[elements.mediumText, styles.sectionHeader]}>
          {events ? 'Events:' : 'No events for this day.'}
        </Text>
        {events?.map(event => (
          <CalendarEvent event={event} key={event.id} />
        ))}

        <Text style={[elements.mediumText, styles.sectionHeader]}>
          {patrols ? 'Patrols:' : 'No patrols for this day.'}
        </Text>
        {patrols?.map(patrol => (
          <CalendarPatrol patrol={patrol} key={patrol.id} onEditPress={createOrEditPatrol} />
        ))}

      </ScrollView>
      <View style={elements.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, elements.splitButton]}
          onPress={createEvent}
        >
          <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
            Create Event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, elements.splitButton]}
          onPress={createOrEditPatrol}
        >
          <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
            {userPatrol ? 'Edit Patrol' : 'Create Patrol'}
          </Text>
        </TouchableOpacity>
      </View>
      {!!selectedPatrolDate && <CalendarPatrolModal dateID={selectedPatrolDate} patrol={userPatrol} onCancel={closePatrolModal} />}
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
});

export default CalendarDayModal;
