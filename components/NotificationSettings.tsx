import React, { useEffect, useState } from 'react';
import * as PushNotifications from '@utility/pushNotifications';
import {
  getCriticalForChannel,
  getSoundForChannel,
  storeCriticalForChannel,
  storeSoundForChannel,
} from '@storage/mmkv';
import DropdownSelector from '@components/inputs/DropdownSelector';
import FormCheckbox from '@components/inputs/FormCheckbox';

interface NotificationSettingsProps {
  title: string;
  channel: string;
}

function NotificationSettings({
  title,
  channel,
}: NotificationSettingsProps) {
  const [sound, setSound] = useState('');
  const [critical, setCritical] = useState(false);

  useEffect(() => {
    async function getFromStorage() {
      setSound(await getSoundForChannel(channel));
      setCritical(await getCriticalForChannel(channel));
    }
    getFromStorage();
  }, [channel]);

  const onSoundSelect = async (item: any) => {
    const value = item.value;
    console.log(value);
    setSound(value);
    storeSoundForChannel(channel, value);
  };

  const onCheckToggle = (checked: boolean) => {
    setCritical(checked);
    storeCriticalForChannel(channel, checked);
  };

  const onButtonPress = async () => {
    PushNotifications.testDisplayNotification(channel);
  };

  return (
    <>
      <DropdownSelector
        title={title}
        options={PushNotifications.availableSounds}
        placeholder="Select a sound"
        selectedValue={sound}
        onSelect={onSoundSelect}
        onRightPress={onButtonPress}
        rightButton={require('@assets/icons/frequency.png')}
      />
      <FormCheckbox
        title="Critical Alert"
        checked={critical}
        onToggle={onCheckToggle}
      />
    </>
  );
}

export default NotificationSettings;
