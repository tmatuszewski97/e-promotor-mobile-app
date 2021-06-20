import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles";

const TitleWithLines = ({ style, title, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.line} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    color: Colors.PRIMARY,
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.PRIMARY,
  },
});

export default TitleWithLines;
