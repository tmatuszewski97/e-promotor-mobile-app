import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Colors } from "../../styles";

const PasswordTextInput = ({ containerStyle, inputStyle, ...props }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  handleOnPressIcon = () => {
    setSecureTextEntry((secureTextEntry) => !secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        color={Colors.PRIMARY}
        style={inputStyle}
        {...props}
      />
      <TouchableOpacity onPress={handleOnPressIcon}>
        {secureTextEntry ? (
          <MaterialCommunityIcons
            name="eye-outline"
            size={25}
            color={Colors.PRIMARY}
          />
        ) : (
          <MaterialCommunityIcons
            name="eye-off-outline"
            size={25}
            color={Colors.PRIMARY}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default PasswordTextInput;
