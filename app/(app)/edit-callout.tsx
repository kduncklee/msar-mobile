import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import { useForm, Controller } from "react-hook-form";
import * as Sentry from "@sentry/react-native";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Header from '../../components/Header';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import { calloutStatus, calloutType, stringToCalloutType } from '../../types/enums';
import DropdownSelector from '../../components/inputs/DropdownSelector';
import FormTextInput from '../../components/inputs/FormTextInput';
import FormTextArea from '../../components/inputs/FormTextArea';
import FormCheckbox from '../../components/inputs/FormCheckbox';
import DropdownMultiselect from '../../components/inputs/DropdownMultiselect';
import ActivityModal from '../../components/modals/ActivityModal';
import "../../storage/global"
import { callout } from '../../types/callout';
import { apiCreateCallout, apiUpdateCallout, useCalloutQuery } from '../../remote/api';
import * as notificationListHelper from "../../utility/notificationListHelper"
import { location, locationToString } from '../../types/location';
import msarEventEmitter from '../../utility/msarEventEmitter';

const Page = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const [showSpinner, setShowSpinner] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState('');
    const { location } = useGlobalSearchParams();

    var existingData;
    if (id) {
        const calloutQuery = useCalloutQuery(id);
        existingData = calloutQuery.data;
    }
    var values = existingData;
    values.ten22 = (values.status !== calloutStatus.ACTIVE);
    values.archived =  (values.status === calloutStatus.ARCHIVED);
    //console.log(values.ten22, values.archived, values.status);
    values.location_string = locationToString(values.location);

    const {
      control,
      watch,
      setValue,
      handleSubmit,
      formState: { dirtyFields, errors },
      trigger,
    } = useForm({ mode: "onTouched", values });
    const ten22 = watch("ten22");
    const locationText = watch("location.text");

    const calloutCreateMutation = useMutation({
        mutationFn: (callout) => apiCreateCallout(callout),
      });
    const calloutUpdateMutation = useMutation({
        mutationFn: ({ idInt, callout }) => apiUpdateCallout(idInt, callout),
      });

    var headerTitle: string = "Create Callout";

    let callOutTypeSelect = [
        { label: "Search", enum: calloutType.SEARCH, value: '0' },
        { label: "Rescue", enum: calloutType.RESCUE, value: '1' },
        { label: "Information Only", enum: calloutType.INFORMATION, value: '2' }
    ]

    let radioFrequencySelect = [
        { label: "LHS Metro", value: '0' },
        { label: "Malibu Metro", value: '1' },
        { label: "L-Tac", value: '2' },
        { label: "MRA MAL", value: '3' }
    ]

    if (id && typeof id === 'string') {
        headerTitle = "Update Callout";
    }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }

        global.selectedLocation = null;

    }, []);

    useEffect(() => {
        if (location) {
            router.back();
            console.log('location=', locationToString(global.selectedLocation));
            setValue("location_string", locationToString(global.selectedLocation), {
                shouldValidate: true,
                shouldDirty: true
              });
        }
    }, [location]);

    const onMutateSuccess = (data, error, variables, context) => {
        console.log(data);
        msarEventEmitter.emit("refreshCallout", {});
        router.replace({
          pathname: "view-callout",
          params: { id: data.id.toString(), title: data.title },
        });
      };

    const createCalloutPressed = (callout) => {

        var shouldShowConfirmation: boolean = false;
        var confirmationMessage = "Are you sure you want to mark this callout 10-22?"
        if (!existingData) {
            shouldShowConfirmation = ten22;
        } else {
            if (existingData.status === calloutStatus.RESOLVED && ten22 === false) {
                shouldShowConfirmation = true;
                confirmationMessage = "Are you sure you want to mark this callout Active?"
            } else if (existingData.status === calloutStatus.ACTIVE && ten22) {
                shouldShowConfirmation = true;
            }
        }

        if (shouldShowConfirmation) {
            Alert.alert('Confirm Status', confirmationMessage, [
                {
                    text: 'Yes',
                    onPress: () => {
                        if (!existingData) {
                            createCallout(callout);
                        } else {
                            updateCallout(callout);
                        }
                    },
                    style: "destructive"
                },
                {
                    text: 'No',
                    style: "cancel"
                }
            ]);
        } else {
            if (!existingData) {
                createCallout(callout);
            } else {
                updateCallout(callout);
            }
        }
    }

    const generateCallout = (callout): callout => {

        var locationObject: location = {};
        if (global.selectedLocation) {
            locationObject = global.selectedLocation;
        }

        if (callout.location?.text) {
            locationObject.text = callout.location.text;
        }

        //console.log("Location: " + JSON.stringify(locationObject));
        callout.location = locationObject;

        if (callout.archived) {
            callout.status = calloutStatus.ARCHIVED;
        } else if (callout.ten22) {
            callout.status = calloutStatus.RESOLVED;
        } else {
            callout.status = calloutStatus.ACTIVE;
        }

        console.log("generated Callout: " + JSON.stringify(callout));

        return callout as callout;
    }

    const createCallout = async (callout) => {
      setSpinnerMessage("Creating Callout...");
      setShowSpinner(true);

      calloutCreateMutation.mutate(generateCallout(callout), {
        onSuccess: onMutateSuccess,
        onError: (error, variables, context) => {
          Sentry.captureException(error);
          Toast.show(`Unable to create callout: ${error.message}`, {
            duration: Toast.durations.LONG,
          });
        },
        onSettled: (data, error, variables, context) => {
          setShowSpinner(false);
        },
      });
    };

    const updateCallout = async (callout) => {
      const idInt: number = parseInt(id);

      setSpinnerMessage("Updating Callout...");
      setShowSpinner(true);

      calloutUpdateMutation.mutate(
        { idInt: idInt, callout: generateCallout(callout) },
        {
          onSuccess: onMutateSuccess,
          onError: (error, variables, context) => {
            Sentry.captureException(error);
            Toast.show(`Unable to update callout: ${error.message}`, {
              duration: Toast.durations.LONG,
            });
          },
          onSettled: (data, error, variables, context) => {
            setShowSpinner(false);
          },
        }
      );
    };

    const locationButtonPressed = () => {
        router.push({ pathname: 'edit-location', params: { locationDescription: locationText, location: '' } });
    }


    return (
      <>
        <SafeAreaView style={styles.container}>
          <Header
            title={headerTitle}
            backButton={true}
            timestamp={new Date()}
          />
          <KeyboardAvoidingView
            style={styles.contentContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500} // Adjust the offset as needed
          >
            <ScrollView style={styles.scrollView}>
              <Controller
                control={control}
                rules={{
                  required: "Title is required.",
                }}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    title={"Title"}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="Title"
                    value={field.value}
                    error={fieldState.error}
                  />
                )}
                name="title"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <DropdownSelector
                    title={"Callout Type"}
                    placeholder={"Select type"}
                    options={callOutTypeSelect}
                    selectedValue={callOutTypeSelect.find(
                      (item) => item.enum === field.value
                    )}
                    onSelect={(item) => {
                      field.onChange(item.enum as calloutType);
                    }}
                  />
                )}
                name="operation_type"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    title={"Location"}
                    placeholder="Location"
                    rightButton={require("../../assets/icons/map.png")}
                    onRightPress={locationButtonPressed}
                    onBlur={field.onBlur}
                    onChange={()=>{}} // Unused
                    value={field.value}
                    editable={false}
                  />
                )}
                name="location_string"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    placeholder="Location Description"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="location.text"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    title={"Subject"}
                    placeholder="Subject"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="subject"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    placeholder="Subject Contact"
                    icon={require("../../assets/icons/phone.png")}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="subject_contact"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    title={"Informant"}
                    placeholder="Informant"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="informant"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    placeholder="Informant Contact"
                    icon={require("../../assets/icons/phone.png")}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="informant_contact"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextArea
                    title={"Circumstances"}
                    placeholder="Circumstances"
                    height={100}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="description"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <DropdownSelector
                    title={"Tactical Talkgroup"}
                    placeholder={"Select Frequency"}
                    options={radioFrequencySelect}
                    selectedValue={radioFrequencySelect.find(
                      (item) => item.label === field.value
                    )}
                    onSelect={(item) => {
                      field.onChange(item.label);
                    }}
                  />
                )}
                name="radio_channel"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <DropdownMultiselect
                    title={"Notifications Made"}
                    placeholder={"Select Notifications"}
                    options={notificationListHelper.list}
                    selectedValues={notificationListHelper.labelsToIndices(
                      field.value
                    )}
                    onSelect={(items) => {
                      field.onChange(
                        notificationListHelper.indicesToLabels(items)
                      );
                    }}
                  />
                )}
                name="notifications_made"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormTextInput
                    title={"Handling Unit / Tag #"}
                    placeholder="Handling Unit / Tag #"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                name="handling_unit"
              />
              <Controller
                control={control}
                render={({ field, fieldState }) => (
                  <FormCheckbox
                    title={"10-22"}
                    checked={field.value}
                    onToggle={field.onChange}
                  />
                )}
                name="ten22"
              />
              {ten22 && (
                <Controller
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormTextArea
                      placeholder="Resolution Notes"
                      height={100}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                  name="resolution"
                />
              )}
              {ten22 && (
                <Controller
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormCheckbox
                      title={"Archive"}
                      checked={field.value}
                      onToggle={field.onChange}
                    />
                  )}
                  name="archived"
                />
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[elements.capsuleButton, styles.submitCalloutButton]}
                onPress={() => handleSubmit(createCalloutPressed)()}
              >
                <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
                  {headerTitle}
                </Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
        {showSpinner && <ActivityModal message={spinnerMessage} />}
      </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryBg
    },
    contentContainer: {
        flex: 1,
    },
    scrollView: {
        marginTop: 0,
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 20
    },
    submitCalloutButton: {
        marginVertical: 20,
        height: 60,
        left: 0,
        right: 0,
    }
});

export default Page;
