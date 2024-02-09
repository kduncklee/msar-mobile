import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { elements } from "../../styles/elements";

type FormSliderProps = {
  title?: string;
  value?: number;
  maximumValue?: number;
  onChange: (value: number) => void;
};

const FormSlider = ({
  title,
  value,
  maximumValue = 1.0,
  onChange,
}: FormSliderProps) => {
  return (
    <View style={styles.container}>
      {!!title && <Text style={elements.fieldTitle}>{title}</Text>}
      <View style={[elements.inputContainer, { height: 50 }]}>
        <Slider
          style={{ flex: 1, padding: 8 }}
          onSlidingComplete={onChange}
          value={value}
          maximumValue={maximumValue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: "column",
  },
});

export default FormSlider;
