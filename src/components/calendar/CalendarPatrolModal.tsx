import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fromDateId } from '@marceloterreiro/flash-calendar';
import { useForm } from '@tanstack/react-form';
import ModalFade from '@/components/modals/common/ModalFade';
import type { patrol } from '@/types/patrol';
import { elements } from '@/styles/elements';
import { usePatrolCreateMutation, usePatrolRemoveMutation, usePatrolUpdateMutation } from '@/remote/mutation';
import FormTextInput from '@/components/inputs/FormTextInput';
import FormDateTimePicker from '@/components/inputs/FormDateTimePicker';
import FormCheckbox from '@/components/inputs/FormCheckbox';

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

  const form = useForm({
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
  const all_day = form.useStore(state => state.values.all_day);

  function deletePatrol(): void {
    console.log('edit patrol');
    Alert.alert('Confirm Patrol Deletion', `Are you sure you want to delete this patrol?`, [
      {
        text: 'Yes',
        onPress: () => {
          patrolRemoveMutation.mutate(patrol.id);
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
      <ScrollView style={styles.dataContainer}>

        <FormCheckbox
          form={form}
          name="all_day"
          title="Default time period"
        />

        {!all_day && (
          <>
            <FormDateTimePicker
              form={form}
              name="start_at"
              title="Start At"
              dateId={dateID}
              mode="time"
            />
            <FormDateTimePicker
              form={form}
              name="finish_at"
              title="Finish At"
              dateId={dateID}
              mode="time"
            />
          </>
        )}

        <FormTextInput
          form={form}
          name="description"
          title="Comment"
          placeholder="Optional: extra information about the patrol"
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
