import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from "../../styles";
import HorizontalIconWithLabel from "./HorizontalIconWithLabel";

const UserBasicInfoItem = ({ iconName, userData, selected, ...props }) => {
  return (
    <HorizontalIconWithLabel
      style={
        selected
          ? [styles.listItemContainer, { backgroundColor: Colors.SECONDARY }]
          : styles.listItemContainer
      }
      iconName={iconName}
      iconSize={40}
      label={`${userData.user.email}\n${userData.user.first_name} ${userData.user.last_name}`}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    margin: 4,
    padding: 4,
    // For Android:
    elevation: 1,
    // For IOS:
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
});

export default UserBasicInfoItem;
