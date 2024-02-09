import React from "react";
import { StyleSheet, View, Text } from "react-native";

type HorrizontalLineProps = {
  title?: string;
  color?: string;
  textColor?: string;
};

const HorrizontalLine = ({
  title,
  color = "white",
  textColor,
}: HorrizontalLineProps) => {
  const appliedTextColor = textColor ?? color;

  return (
    <View style={[styles.container]}>
      <View style={[styles.line, { backgroundColor: color }]} />
      {title && (
        <>
          <View>
            <Text style={[styles.text, { color: appliedTextColor }]}>
              {title}
            </Text>
          </View>
          <View style={[styles.line, { backgroundColor: color }]} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
  },
});

export default HorrizontalLine;
