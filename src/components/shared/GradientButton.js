import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../styles";

const GradientButton = ({ fontSize, text, ...props }) => {
  return (
    <TouchableOpacity {...props}>
      <LinearGradient
        style={styles.buttonContainer}
        colors={[
          Colors.LIGHTER_PRIMARY,
          Colors.PRIMARY,
          Colors.LIGHTER_PRIMARY,
        ]}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: fontSize,
            textAlign: "center",
          }}
        >
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GradientButton;
