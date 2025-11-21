import type { callout } from '@/types/callout';
import type { location } from '@/types/location';
import type { LabelValue } from '@/utility/reactForm';
import Header from '@components/Header';
import ActivityModal from '@components/modals/ActivityModal';
import * as Sentry from '@sentry/react-native';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { useStore } from '@tanstack/react-form';
import msarEventEmitter from '@utility/msarEventEmitter';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAvoidingCustomView from '@/components/KeyboardAvoidingCustomView';
import { useAppForm } from '@/hooks/form';
import useStatusBarColor from '@/hooks/useStatusBarColor';
import { useCalloutCreateMutation, useCalloutUpdateMutation } from '@/remote/mutation';
import { useCalloutQuery, useNotificationsAvailableQuery, useOperationTypesAvailableQuery, useRadioChannelsAvailableQuery } from '@/remote/query';
import { useEditingLocation } from '@/storage/mmkv';
import { calloutStatus } from '@/types/enums';
import { locationToString } from '@/types/location';
import { handleBackPressed, useBackHandler } from '@/utility/backHandler';
import { labelValueItem } from '@/utility/reactForm';

function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState('');

  const [editingLocation, setEditingLocation] = useEditingLocation();
  useStatusBarColor();

  const calloutQuery = useCalloutQuery(id);
  let existingData: callout | undefined;
  if (id) {
    existingData = calloutQuery.data;
  }
  const notificationsAvailableQuery = useNotificationsAvailableQuery();
  const radioChanelsAvailableQuery = useRadioChannelsAvailableQuery();
  const operationTypesAvailableQuery = useOperationTypesAvailableQuery();

  const calloutCreateMutation = useCalloutCreateMutation();
  const calloutUpdateMutation = useCalloutUpdateMutation();

  const form = useAppForm({
    defaultValues: {
      title: existingData?.title ?? '',
      operationType: existingData?.operation_type ?? '',
      locationText: locationToString(existingData?.location),
      locationDescText: existingData?.location?.text,
      subject: existingData?.subject,
      subjectContact: existingData?.subject_contact,
      informant: existingData?.informant,
      informantContact: existingData?.informant_contact,
      circumstances: existingData?.description,
      radioFrequency: existingData?.radio_channel,
      additionalRadioFrequencies: existingData?.additional_radio_channels ?? [],
      notificationsMade: existingData?.notifications_made ?? [],
      handlingUnit: existingData?.handling_unit,
      ten22: existingData?.status === calloutStatus.RESOLVED,
      archived: existingData?.status === calloutStatus.ARCHIVED,
      resolutionNotes: existingData?.resolution,
    },
    onSubmit: async ({ value }) => {
      console.log('form submit', value);

      let locationObject: location = {};
      if (editingLocation) {
        locationObject = editingLocation;
      }
      locationObject.text = value.locationDescText;

      // console.log(`Location: ${JSON.stringify(locationObject)}`);
      const callout: callout = {
        title: value.title,
        operation_type: value.operationType,
        description: value.circumstances,
        subject: value.subject,
        subject_contact: value.subjectContact,
        informant: value.informant,
        informant_contact: value.informantContact,
        radio_channel: value.radioFrequency,
        additional_radio_channels: value.additionalRadioFrequencies,
        status: value.ten22 ? calloutStatus.RESOLVED : calloutStatus.ACTIVE,
        notifications_made: value.notificationsMade,
        resolution: value.resolutionNotes,
        location: locationObject,
        handling_unit: value.handlingUnit,
      };

      if (value.archived) {
        callout.status = calloutStatus.ARCHIVED;
      }

      if (callout.status === calloutStatus.ACTIVE) {
        callout.resolution = '';
      }

      createCalloutPressed(callout);
    },
  });
  const ten22 = useStore(form.store, state => state.values.ten22);

  const locationChanged = !!(editingLocation && (JSON.stringify(existingData?.location) !== JSON.stringify(editingLocation)));
  const calloutChanged = form.state.isDirty || locationChanged;
  useBackHandler(calloutChanged);
  const backPressed = () => {
    handleBackPressed(calloutChanged);
  };

  let headerTitle: string = 'Create Callout';
  if (id && typeof id === 'string') {
    headerTitle = 'Update Callout';
  }

  const notificationsAvailable: LabelValue[] = [];
  if (notificationsAvailableQuery.data) {
    notificationsAvailableQuery.data.results.forEach((data: any) => {
      notificationsAvailable.push(labelValueItem(data.name));
    });
  }
  const notificationsMade = form.getFieldValue('notificationsMade') ?? [];
  notificationsMade.forEach((name: string) => {
    if (!notificationsAvailable.find(item => (item.label === name))) {
      notificationsAvailable.push(labelValueItem(name));
    }
  });

  const primaryRadioChannelsAvailable: LabelValue[] = [{ label: '', value: undefined }];
  const additionalRadioChannelsAvailable: LabelValue[] = [];
  if (radioChanelsAvailableQuery.data) {
    radioChanelsAvailableQuery.data.results.forEach((data: any) => {
      if (data.is_primary) {
        primaryRadioChannelsAvailable.push(labelValueItem(data.name));
      }
      if (data.is_additional) {
        additionalRadioChannelsAvailable.push(labelValueItem(data.name));
      }
    });
  }
  const radioFrequency = form.getFieldValue('radioFrequency');
  if (radioFrequency && (!primaryRadioChannelsAvailable.find(item => (item.label === radioFrequency)))) {
    primaryRadioChannelsAvailable.push(labelValueItem(radioFrequency));
  }
  const additionalRadioFrequencies = form.getFieldValue('additionalRadioFrequencies') ?? [];
  additionalRadioFrequencies.forEach((name: string) => {
    if (!additionalRadioChannelsAvailable.find(item => (item.label === name))) {
      additionalRadioChannelsAvailable.push(labelValueItem(name));
    }
  });

  const operationTypesAvailable: LabelValue[] = [];
  if (operationTypesAvailableQuery.data) {
    operationTypesAvailableQuery.data.results.forEach((data: any) => {
      if (data.enabled) {
        operationTypesAvailable.push(labelValueItem(data.name));
      }
    });
  }
  const operationTypeSelected = form.getFieldValue('operationType');
  if (operationTypeSelected && !operationTypesAvailable.find(item => (item.label === operationTypeSelected))) {
    operationTypesAvailable.push(labelValueItem(operationTypeSelected));
  }

  useEffect(() => {
    if (editingLocation) {
      console.log('editingLocation useEffect', editingLocation);
      form.setFieldValue('locationText', locationToString(editingLocation));
      // This is only for UI, don't mark the form as dirty.
      form.setFieldMeta('locationText', prev => ({ ...prev, isDirty: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLocation]);

  useEffect(() => {
    console.log('existingData useEffect', existingData?.location);
    if (existingData) {
      setEditingLocation(existingData.location);
    }
    else {
      setEditingLocation(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingData]);

  const createCalloutPressed = (callout: callout) => {
    let shouldShowConfirmation: boolean = false;
    let confirmationMessage = 'Are you sure you want to mark this callout 10-22?';
    if (!existingData) {
      shouldShowConfirmation = ten22;
    }
    else {
      if (existingData.status === calloutStatus.RESOLVED && ten22 === false) {
        shouldShowConfirmation = true;
        confirmationMessage = 'Are you sure you want to mark this callout Active?';
      }
      else if (existingData.status === calloutStatus.ACTIVE && ten22) {
        shouldShowConfirmation = true;
      }
    }

    if (shouldShowConfirmation) {
      Alert.alert('Confirm Status', confirmationMessage, [
        {
          text: 'Yes',
          onPress: () => {
            createOrUpdateCallout(callout);
          },
          style: 'destructive',
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ]);
    }
    else {
      createOrUpdateCallout(callout);
    }
  };

  const createOrUpdateCallout = async (callout: callout) => {
    if (!validateFields(callout)) {
      return;
    }
    if (!existingData) {
      createCallout(callout);
    }
    else {
      updateCallout(callout);
    }
  };

  const createCallout = async (callout: callout) => {
    setSpinnerMessage('Creating Callout...');
    setShowSpinner(true);

    calloutCreateMutation.mutate(callout, {
      onSuccess: (data, _variables, _context) => {
        console.log(data);
        msarEventEmitter.emit('refreshCallout', {});
        router.replace({ pathname: 'view-callout', params: { id: data.id.toString(), title: data.title } });
      },
      onError: (error, _variables, _context) => {
        Sentry.captureException(error);
        Toast.show(`Unable to create callout: ${error.message}`, {
          duration: Toast.durations.LONG,
        });
      },
      onSettled: (_data, _error, _variables, _context) => {
        setShowSpinner(false);
      },
    });
  };

  const updateCallout = async (callout: callout) => {
    const idInt: number = Number.parseInt(id);

    setSpinnerMessage('Updating Callout...');
    setShowSpinner(true);

    calloutUpdateMutation.mutate(
      { idInt, callout },
      {
        onSuccess: (data, _variables, _context) => {
          console.log(data);
          msarEventEmitter.emit('refreshCallout', {});
          router.replace({
            pathname: 'view-callout',
            params: { id: data.id.toString(), title: data.title },
          });
        },
        onError: (error, _variables, _context) => {
          Sentry.captureException(error);
          Toast.show(`Unable to update callout: ${error.message}`, {
            duration: Toast.durations.LONG,
          });
        },
        onSettled: (_data, _error, _variables, _context) => {
          setShowSpinner(false);
        },
      },
    );
  };

  const validateFields = (callout: callout): boolean => {
    // TODO: add validation
    let error = '';

    if (!callout.title) {
      error += 'Title is a required field\n';
    }
    if (error) {
      Alert.alert('Validation failure', error);
    }
    return !error;
  };

  const locationButtonPressed = () => {
    router.push({ pathname: 'edit-location' });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header title={headerTitle} backButton onBackPressed={backPressed} timestamp={new Date()} />
        <KeyboardAvoidingCustomView>
          <ScrollView style={styles.scrollView}>
            <form.AppField
              name="operationType"
              children={field => (
                <field.FormDropdownSelector
                  title="Callout Type"
                  options={operationTypesAvailable}
                  placeholder="Select type"
                />
              )}
            />
            <form.AppField
              name="title"
              children={field => (
                <field.FormTextInput
                  title="Title"
                  placeholder="Title - Few Word Summary"
                />
              )}
            />
            <form.AppField
              name="circumstances"
              children={field => (
                <field.FormTextArea
                  title="Circumstances / Call Details"
                  height={100}
                  placeholder="Call Details - Full Description"
                />
              )}
            />
            <form.AppField
              name="locationText"
              children={field => (
                <field.FormTextInput
                  title="Location"
                  rightButton="map-search-outline"
                  onRightPress={locationButtonPressed}
                  editable={false}
                />
              )}
            />
            <form.AppField
              name="locationDescText"
              children={field => (
                <field.FormTextInput
                  placeholder="Location Description"
                />
              )}
            />
            <form.AppField
              name="subject"
              children={field => (
                <field.FormTextInput
                  title="Subject / Victim / Missing Person"
                  placeholder="Subject"
                />
              )}
            />
            <form.AppField
              name="subjectContact"
              children={field => (
                <field.FormTextInput
                  icon="phone"
                  placeholder="Subject Contact"
                />
              )}
            />
            <form.AppField
              name="informant"
              children={field => (
                <field.FormTextInput
                  title="Informant / Reporting Party"
                  placeholder="Informant"
                />
              )}
            />
            <form.AppField
              name="informantContact"
              children={field => (
                <field.FormTextInput
                  icon="phone"
                  placeholder="Informant Contact"
                />
              )}
            />
            <form.AppField
              name="radioFrequency"
              children={field => (
                <field.FormDropdownSelector
                  title="Tactical Talkgroup"
                  options={primaryRadioChannelsAvailable}
                  placeholder="Select Frequency"
                />
              )}
            />
            <form.AppField
              name="additionalRadioFrequencies"
              mode="array"
              children={field => (
                <field.FormDropdownMultiselect
                  title="Other Radio Channels"
                  options={additionalRadioChannelsAvailable}
                  placeholder="Select Frequencies"
                />
              )}
            />
            <form.AppField
              name="notificationsMade"
              children={field => (
                <field.FormDropdownMultiselect
                  title="Notifications Made"
                  options={notificationsAvailable}
                  placeholder="Select Notifications"
                />
              )}
            />
            <form.AppField
              name="handlingUnit"
              children={field => (
                <field.FormTextInput
                  title="Handling Unit / Tag #"
                />
              )}
            />
            <form.AppField
              name="ten22"
              children={field => (
                <field.FormCheckbox
                  title="10-22"
                />
              )}
            />
            {ten22
              && (
                <form.AppField
                  name="resolutionNotes"
                  children={field => (
                    <field.FormTextArea
                      height={100}
                      placeholder="Resolution Notes"
                    />
                  )}
                />
              )}
            {ten22
              && (
                <form.AppField
                  name="archived"
                  children={field => (
                    <field.FormCheckbox
                      title="Archive"
                    />
                  )}
                />
              )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[elements.capsuleButton, styles.submitCalloutButton]}
              onPress={form.handleSubmit}
            >
              <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>{headerTitle}</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingCustomView>
      </SafeAreaView>
      {showSpinner
        && <ActivityModal message={spinnerMessage} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  submitCalloutButton: {
    marginVertical: 20,
    height: 60,
    left: 0,
    right: 0,
  },
});

export default Page;
