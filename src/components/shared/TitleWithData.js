import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles";
import * as Animatable from "react-native-animatable";

const TitleWithData = ({
  dataComponent,
  title,
  style,
  error,
  errorText,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: error ? Colors.RED : Colors.PRIMARY },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
      </View>
      <View
        style={[
          styles.dataContainer,
          { borderColor: error ? Colors.RED : Colors.PRIMARY },
        ]}
      >
        {dataComponent}
      </View>
      {error ? (
        <Animatable.View animation="fadeInLeft">
          <Text style={styles.error}>{errorText}</Text>
        </Animatable.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  dataContainer: {
    borderWidth: 2,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  error: {
    color: Colors.RED,
  },
  title: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  titleContainer: {
    paddingHorizontal: 4,
    textTransform: "capitalize",
  },
});

export default TitleWithData;
