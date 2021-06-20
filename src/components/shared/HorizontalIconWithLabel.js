import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../styles";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const HorizontalIconWithLabel = ({
  iconName,
  iconSize,
  label,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity style={[styles.rowContainer, style]} {...props}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={iconName}
          color={Colors.PRIMARY}
          size={iconSize}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
  },
  text: {
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default HorizontalIconWithLabel;
