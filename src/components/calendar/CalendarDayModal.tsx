import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fromDateId } from '@marceloterreiro/flash-calendar';
import ModalFade from '@/components/modals/common/ModalFade';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import { elements } from '@/styles/elements';
import CalendarPatrol from '@/components/calendar/CalendarPatrol';
import { isUserSelf } from '@/types/user';
import useAuth from '@/hooks/useAuth';
import { usePatrolCreateMutation } from '@/remote/mutation';

interface CalendarDayModalProps {
  dateID: string;
  events: event[];
  patrols: patrol[];
  onCancel: () => void;
};

function CalendarDayModal({ dateID, events, patrols, onCancel }: CalendarDayModalProps) {
  const { username } = useAuth();
  const patrolCreateMutation = usePatrolCreateMutation();

  console.log(events, patrols);

  function createEvent() {
    Alert.alert(
      'Not implemented yet',
      'Use the website to create events.',
    );
  }

  function completeCreatePatrol() {
    const patrol: patrol = {
      start_at: fromDateId(dateID),
    };

    patrolCreateMutation.mutate(patrol);
  }

  function createPatrol() {
    const userPatrols = patrols?.filter(p => isUserSelf(p.member, username));
    if (userPatrols?.length) {
      console.log('userPatrols', username, userPatrols);
      Alert.alert(
        'Duplicate patrol',
        'You already have a patrol on this day. Click the patrol above to edit it.',
      );
    }
    else {
      console.log('create patrol');
      Alert.alert('Confirm Patrol Creation', `Are you sure you want to sign up for patrol on ${dateID}?`, [
        {
          text: 'Yes',
          onPress: completeCreatePatrol,
          style: 'destructive',
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ]);
    }
  }

  return (
    <ModalFade
      modalVisible={!!dateID}
      onCancel={onCancel}
      header={dateID}
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
          <CalendarPatrol patrol={patrol} key={patrol.id} />
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
          onPress={createPatrol}
        >
          <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
            Create Patrol
          </Text>
        </TouchableOpacity>
      </View>
    </ModalFade>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    zIndex: 101,
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  sectionHeader: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
