import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as PushNotifications from "../utility/pushNotifications";
import {
  getCriticalForChannel,
  getSoundForChannel,
  storeCriticalForChannel,
  storeSoundForChannel,
} from "../storage/storage";
import DropdownSelector from "./inputs/DropdownSelector";
import FormCheckbox from "./inputs/FormCheckbox";

type NotificationSettingsProps = {
  title: string;
  channel: string;
};

const NotificationSettings = ({
  title,
  channel,
}: NotificationSettingsProps) => {
  const [sound, setSound] = useState("");
  const [vibration, setVibration] = useState("");
  const [critical, setCritical] = useState(false);

  useEffect(() => {
    async function getFromStorage() {
      setSound(await getSoundForChannel(channel));
      setCritical(await getCriticalForChannel(channel));
    }
    getFromStorage();
  }, []);

  const storeSetting = async () => {
    const value = sound + "-standard";
    console.log(`Setting ${channel} = ${value}`);
  };

  const onSoundSelect = async (item: any) => {
    const value = item.value;
    console.log(value);
    setSound(value);
    storeSoundForChannel(channel, value);
  };

  const onVibrationSelect = async (item: any) => {
    const value = item.value;
    console.log(value);
    setSound(value);
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
        rightButton={require("../assets/icons/frequency.png")}
      />
      <FormCheckbox
        title={"Critical Alert"}
        checked={critical}
        onToggle={onCheckToggle}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: "column",
  },
  dropdown: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default NotificationSettings;
