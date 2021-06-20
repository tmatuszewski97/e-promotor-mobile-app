import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles/index";
import { Ionicons } from "react-native-vector-icons";

const Placeholder = ({ ...props }) => {
  return (
    <View style={styles.container} {...props}>
      <Ionicons name="sad-outline" size={46} color={Colors.PRIMARY} />
      <Text style={styles.text}>{`Brak wyników`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 4,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
});

export default Placeholder;
