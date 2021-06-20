import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../styles";
import { MaterialIcons } from "react-native-vector-icons";

const HideableContent = ({ contentComponent, headerTitle, ...props }) => {
  const [visible, setVisible] = useState(true);

  const handleOnPressHeader = () => {
    setVisible((visible) => !visible);
  };

  return (
    <View style={styles.container} {...props}>
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={handleOnPressHeader}
      >
        {visible ? (
          <MaterialIcons
            name="arrow-drop-down"
            size={25}
            color={Colors.PRIMARY}
          />
        ) : (
          <MaterialIcons
            name="arrow-drop-up"
            size={25}
            color={Colors.PRIMARY}
          />
        )}
        <Text style={styles.headerText}>{headerTitle}</Text>
        {visible ? (
          <MaterialIcons
            name="arrow-drop-down"
            size={25}
            color={Colors.PRIMARY}
          />
        ) : (
          <MaterialIcons
            name="arrow-drop-up"
            size={25}
            color={Colors.PRIMARY}
          />
        )}
      </TouchableOpacity>
      {visible ? contentComponent : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 24,
    color: Colors.PRIMARY,
  },
  container: {
    marginTop: 4,
    padding: 4,
    borderStyle: "solid",
    borderColor: Colors.PRIMARY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default HideableContent;
