import type { patrol } from '@/types/patrol';
import { fromDateId } from '@marceloterreiro/flash-calendar';
import { useStore } from '@tanstack/react-form';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import KeyboardAvoidingCustomView from '@/components/KeyboardAvoidingCustomView';
import ModalFade from '@/components/modals/common/ModalFade';
import { useAppForm } from '@/hooks/form';
import { usePatrolCreateMutation, usePatrolRemoveMutation, usePatrolUpdateMutation } from '@/remote/mutation';
import { elements } from '@/styles/elements';

interface CalendarPatrolModalProps {
  dateID: string;
  patrol?: patrol;
  onCancel: () => void;
};

function CalendarPatrolModal({ dateID, patrol, onCancel }: CalendarPatrolModalProps) {
  const patrolCreateMutation = usePatrolCreateMutation();
  const patrolUpdateMutation = usePatrolUpdateMutation();
  const patrolRemoveMutation = usePatrolRemoveMutation();

  console.log('CalendarPatrolModal', dateID, patrol);

  const form = useAppForm({
    defaultValues: {
      id: patrol?.id,
      all_day: !patrol?.finish_at,
      start_at: patrol?.start_at ?? fromDateId(dateID),
      finish_at: patrol?.finish_at,
      description: patrol?.description,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (!value.all_day && !value.finish_at) {
          return { fields: { finish_at: 'This field is required' } };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      console.log('form submit', value);
      const updated_patrol: patrol = {
        start_at: value.start_at,
        finish_at: value.all_day ? null : value.finish_at,
        description: value.description,
      };

      if (value.id) {
        patrolUpdateMutation.mutate({ idInt: value.id, patrol: updated_patrol }, {
          onSuccess: onCancel,
        });
      }
      else {
        patrolCreateMutation.mutate(updated_patrol, {
          onSuccess: onCancel,
        });
      }
    },
  });
  const all_day = useStore(form.store, state => state.values.all_day);

  function deletePatrol(): void {
    console.log('edit patrol');
    Alert.alert('Confirm Patrol Deletion', `Are you sure you want to delete this patrol?`, [
      {
        text: 'Yes',
        onPress: () => {
          if (patrol) {
            patrolRemoveMutation.mutate(patrol.id);
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
      headerRightIcon="delete-outline"
      onHeaderRight={deletePatrol}
    >
      <KeyboardAvoidingCustomView>
        <ScrollView style={styles.dataContainer}>

          <form.AppField
            name="all_day"
            children={field => (
              <field.FormCheckbox
                title="Default time period"
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
                title="Comment"
                placeholder="Optional: extra information about the patrol"
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
              {patrol?.id ? 'Update patrol' : 'Create Patrol'}
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

export default CalendarPatrolModal;
