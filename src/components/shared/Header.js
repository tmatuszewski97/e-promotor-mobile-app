import React from "react";
import { StyleSheet, View } from "react-native";
import IconWithLabel from "./IconWithLabel";

const Header = ({ iconsWithProps = [], ...props }) => {
  return (
    <View style={styles.container} {...props}>
      {iconsWithProps.map((item, index) => {
        return (
          <IconWithLabel
            key={index}
            iconName={item.iconName}
            iconLabel={item.iconLabel}
            onPress={item.onPress}
            style={{ marginHorizontal: 10 }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
