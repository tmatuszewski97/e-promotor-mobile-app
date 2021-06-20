import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "../../styles/index";

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
      <Text style={styles.text}>{`Wczytywanie`}</Text>
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

export default Loading;
