import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Colors } from "../../styles";

const CustomCard = ({
  iconName,
  iconColor,
  titleText,
  titleColor,
  bodyComponent,
  style,
  ...props
}) => {
  return (
    <View style={[styles.cardContainer, style]} {...props}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name={iconName} size={40} color={iconColor} />

        <Text style={[styles.text, { color: titleColor }]}>{titleText}</Text>
      </View>
      <Divider style={styles.divider} />
      {bodyComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderStyle: "solid",
    marginTop: 10,
    padding: 20,
  },
  divider: {
    marginVertical: 5,
    height: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  text: {
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CustomCard;
