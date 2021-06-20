import React from "react";
import * as Animatable from "react-native-animatable";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../styles";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const RoundButton = ({ iconName, onPress, style, visible, ...props }) => {
  return (
    <Animatable.View
      animation={visible ? "bounceIn" : "bounceOut"}
      duration={500}
      style={[styles.buttonContainer, style]}
      {...props}
    >
      <TouchableOpacity onPress={onPress} style={styles.touchableContainer}>
        <MaterialCommunityIcons
          name={iconName}
          color={Colors.WHITE}
          size={30}
        />
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    borderRadius: 50,
  },
  touchableContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoundButton;
