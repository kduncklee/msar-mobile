import type { event } from '@/types/event';
import type { LabelValue } from '@/utility/reactForm';
import { fromDateId } from '@marceloterreiro/flash-calendar';
import { useStore } from '@tanstack/react-form';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import KeyboardAvoidingCustomView from '@/components/KeyboardAvoidingCustomView';
import ModalFade from '@/components/modals/common/ModalFade';
import { useAppForm } from '@/hooks/form';
import { useEventCreateMutation, useEventRemoveMutation, useEventUpdateMutation } from '@/remote/mutation';
import { elements } from '@/styles/elements';
import { eventType } from '@/types/enums';

interface CalendarEventModalProps {
  dateID: string;
  event?: event;
  onCancel: () => void;
};

const eventTypeOptions: LabelValue[] = [
  { label: 'Training', value: eventType.TRAINING },
  { label: 'Meeting', value: eventType.MEETING },
  { label: 'Operation', value: eventType.OPERATION },
  { label: 'Community', value: eventType.COMMUNITY },
];

function CalendarEventModal({ dateID, event, onCancel }: CalendarEventModalProps) {
  const eventCreateMutation = useEventCreateMutation();
  const eventUpdateMutation = useEventUpdateMutation();
  const eventRemoveMutation = useEventRemoveMutation();

  const defaultStartDate = fromDateId(dateID);
  defaultStartDate.setHours(8, 0, 0, 0);

  const defaultFinishDate = fromDateId(dateID);
  defaultFinishDate.setHours(17, 0, 0, 0);

  const initialStartDate = event?.start_at ? new Date(event.start_at) : defaultStartDate;
  const initialFinishDate = event?.finish_at ? new Date(event.finish_at) : defaultFinishDate;

  const form = useAppForm({
    defaultValues: {
      id: event?.id,
      title: event?.title ?? '',
      type: (event?.type as string) ?? eventType.TRAINING,
      leaders: event?.leaders ?? '',
      location: event?.location ?? '',
      lat: event?.lat ? String(event.lat) : '',
      lon: event?.lon ? String(event.lon) : '',
      description: event?.description ?? '',
      all_day: event?.all_day ?? false,
      start_at: initialStartDate,
      finish_at: initialFinishDate,
      published: event?.published ?? false,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (!value.title?.trim()) {
          return { fields: { title: 'Title is required' } };
        }
        if (!value.all_day && !value.finish_at) {
          return { fields: { finish_at: 'Finish time is required' } };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      console.log('event form submit', value);
      const updatedEvent: event = {
        title: value.title.trim(),
        type: value.type,
        leaders: value.leaders ? value.leaders.trim() : null,
        description: value.description ? value.description.trim() : null,
        location: value.location ? value.location.trim() : null,
        lat: value.lat ? value.lat.trim() : null,
        lon: value.lon ? value.lon.trim() : null,
        all_day: value.all_day,
        start_at: value.start_at,
        finish_at: value.all_day ? undefined : value.finish_at,
        published: value.published,
      };

      if (value.id) {
        eventUpdateMutation.mutate({ idInt: value.id, event: updatedEvent }, {
          onSuccess: onCancel,
        });
      }
      else {
        eventCreateMutation.mutate(updatedEvent, {
          onSuccess: onCancel,
        });
      }
    },
  });

  const all_day = useStore(form.store, state => state.values.all_day);

  function deleteEvent(): void {
    Alert.alert('Confirm Event Deletion', 'Are you sure you want to delete this event?', [
      {
        text: 'Yes',
        onPress: () => {
          if (event?.id) {
            eventRemoveMutation.mutate(event.id);
          }
          onCancel();
        },
        style: 'destructive',
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  }

  return (
    <ModalFade
      modalVisible={!!dateID}
      onCancel={onCancel}
      headerTitle={dateID}
      headerRightIcon={event?.id ? 'delete-outline' : undefined}
      onHeaderRight={event?.id ? deleteEvent : undefined}
    >
      <KeyboardAvoidingCustomView>
        <ScrollView style={styles.dataContainer}>

          <form.AppField
            name="title"
            children={field => (
              <field.FormTextInput
                title="Title *"
                placeholder="e.g. Monthly Training Operation"
              />
            )}
          />

          <form.AppField
            name="type"
            children={field => (
              <field.FormDropdownSelector
                title="Event Type"
                options={eventTypeOptions}
                placeholder="Select event type"
              />
            )}
          />

          <form.AppField
            name="leaders"
            children={field => (
              <field.FormTextInput
                title="Leaders"
                placeholder="Optional: Leader name(s)"
              />
            )}
          />

          <form.AppField
            name="location"
            children={field => (
              <field.FormTextInput
                title="Location"
                placeholder="e.g. LHS or Staging Area"
              />
            )}
          />

          <form.AppField
            name="all_day"
            children={field => (
              <field.FormCheckbox
                title="All Day Event"
              />
            )}
          />

          {!all_day && (
            <>
              <form.AppField
                name="start_at"
                children={field => (
                  <field.FormDateTimePicker
                    title="Start At"
                    dateId={dateID}
                    mode="time"
                  />
                )}
              />
              <form.AppField
                name="finish_at"
                children={field => (
                  <field.FormDateTimePicker
                    title="Finish At"
                    dateId={dateID}
                    mode="time"
                  />
                )}
              />
            </>
          )}

          <form.AppField
            name="description"
            children={field => (
              <field.FormTextInput
                title="Description"
                placeholder="Optional: details, equipment, requirements..."
              />
            )}
          />

        </ScrollView>
        <View style={elements.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[elements.capsuleButton, elements.splitButton]}
            onPress={form.handleSubmit}
          >
            <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
              {event?.id ? 'Update Event' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingCustomView>
    </ModalFade>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    zIndex: 101,
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default CalendarEventModal;
