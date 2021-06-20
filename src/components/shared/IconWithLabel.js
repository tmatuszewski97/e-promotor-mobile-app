import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../styles";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const IconWithLabel = ({ iconName, iconLabel, style, ...props }) => {
  return (
    <TouchableOpacity style={[styles.optionContainer, style]} {...props}>
      <MaterialCommunityIcons name={iconName} color={Colors.WHITE} size={26} />
      <Text style={styles.optionLabel}>{iconLabel}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 12,
    color: Colors.WHITE,
  },
});

export default IconWithLabel;
