import { View } from 'react-native';
import InformationTray from '@components/fields/InformationTray';
import InformationField from '@components/fields/InformationField';
import TextAreaField from '@components/fields/TextAreaField';
import LocationField from '@components/fields/LocationField';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { getFullTimeString } from '@utility/dateHelper';
import { router } from 'expo-router';
import type { callout } from '@/types/callout';
import { colorForResponseType, textForCalloutStatus, textForResponseType, textForType } from '@/types/calloutSummary';
import { calloutStatus } from '@/types/enums';
import { locationIsSet } from '@/types/location';
import InformationPhoneField from '@/components/fields/InformationPhoneField';

interface CalloutInformationTabProps {
  callout: callout;
};

function CalloutInformationTab({ callout }: CalloutInformationTabProps) {
  const showEdit: boolean = callout.status !== calloutStatus.ARCHIVED;

  const editDetailsPressed = () => {
    console.log('edit details');
    router.push({ pathname: 'edit-callout', params: { id: callout.id.toString() } });
  };

  return (
    <>
      <InformationTray
        title="Details"
        titleBarColor={colors.red}
        editButton={showEdit}
        onEditPress={editDetailsPressed}
      >
        <View style={{ marginTop: 8 }} />
        {!!callout.title
        && <TextAreaField value={callout.title} valueColor={colors.secondaryYellow} />}
        {!!callout.created_at
        && (
          <InformationField
            title="Time of Dispatch"
            value={getFullTimeString(callout.created_at)}
          />
        )}
        <View style={elements.informationDiv} />
        <InformationField
          title="Type"
          value={textForType(callout.operation_type)}
        />
        <View style={elements.informationDiv} />
        {!!callout.subject
        && (
          <InformationField
            title="Subject"
            value={callout.subject}
          />
        )}
        {!!callout.subject_contact
        && (
          <InformationPhoneField
            value={callout.subject_contact}
          />
        )}
        {(!!callout.subject || !!callout.subject_contact)
        && <View style={elements.informationDiv} />}
        {!!callout.informant
        && (
          <InformationField
            title="Informant"
            value={callout.informant}
          />
        )}
        {!!callout.informant_contact
        && (
          <InformationPhoneField
            value={callout.informant_contact}
          />
        )}
        {(!!callout.informant || !!callout.informant_contact)
        && <View style={elements.informationDiv} />}
        {!!callout.radio_channel
        && (
          <InformationField
            title="Tactical Talkgroup"
            value={callout.radio_channel}
          />
        )}
        {!!callout.additional_radio_channels?.length
        && (
          <InformationField
            title="Other Radio Channels"
            value={callout.additional_radio_channels.join(', ')}
          />
        )}
        {!!callout.notifications_made?.length
        && (
          <InformationField
            title="Notifications Made"
            value={callout.notifications_made.join(', ')}
          />
        )}
        {!!callout.handling_unit
        && (
          <InformationField
            title="Handling Unit / Tag #"
            value={callout.handling_unit}
          />
        )}
        {!!callout.description && (
          <>
            <View style={elements.informationDiv} />
            <TextAreaField
              title="Circumstances"
              value={callout.description}
              valueColor={colors.secondaryYellow}
            />
          </>
        )}
        {!!callout.resolution && (
          <>
            <View style={elements.informationDiv} />
            <TextAreaField
              title="Resolution"
              value={callout.resolution}
              valueColor={colors.secondaryYellow}
            />
          </>
        )}
        <View style={{ height: 10 }} />
      </InformationTray>
      {(locationIsSet(callout.location) || callout.location?.text)
      && (
        <InformationTray
          title="Location"
          titleBarColor={colors.blue}
          editButton={showEdit}
          onEditPress={editDetailsPressed}
        >
          <LocationField location={callout.location} />
        </InformationTray>
      )}
      <InformationTray
        title="Additional Information"
        titleBarColor={colors.secondaryYellow}
        titleTextColor={colors.black}
        editButton={showEdit}
        onEditPress={editDetailsPressed}
      >
        <View style={{ marginTop: 8 }} />
        <InformationField
          title="Status"
          value={textForCalloutStatus(callout.status)}
        />
        <View style={elements.informationDiv} />
        {!!callout.my_response
        && (
          <>
            <InformationField
              title="My Response"
              value={textForResponseType(callout.my_response)}
              valueColor={colorForResponseType(callout.my_response)}
            />

            <View style={elements.informationDiv} />
          </>
        )}
        {!!callout.created_by
        && (
          <InformationField
            title="Callout Created by"
            value={callout.created_by.full_name}
          />
        )}
        <View style={{ height: 10 }} />
      </InformationTray>

      <View style={{ height: 100 }} />
    </>
  );
}

export default CalloutInformationTab;
