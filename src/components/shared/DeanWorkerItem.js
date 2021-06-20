import React from "react";
import { StyleSheet } from "react-native";
import HorizontalIconWithLabel from "./HorizontalIconWithLabel";

const DeanWorkerItem = ({ item, ...props }) => {
  return (
    <HorizontalIconWithLabel
      style={styles.listItemContainer}
      iconName={`account-cog`}
      iconSize={40}
      label={`${item.user.email}\n${item.user.first_name} ${item.user.last_name}`}
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

export default DeanWorkerItem;
