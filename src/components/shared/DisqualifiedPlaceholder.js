import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles/index";
import { Ionicons } from "react-native-vector-icons";

const DisqualifiedPlaceholder = ({ ...props }) => {
  return (
    <View style={styles.container} {...props}>
      <View style={styles.infoContainer}>
        <Ionicons name="sad-outline" size={46} color={Colors.PRIMARY} />
        <Text
          style={styles.title}
        >{`Zostałeś zdyskwalifikowany za bezczynność `}</Text>
        <Text
          style={styles.text}
        >{`Nie panikuj!\nPrzeprowadzający wybory widzi Twój aktualny stan i na pewno się z Tobą niebawem skontaktuje.`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  infoContainer: {
    alignItems: "center",
    padding: 4,
  },
  text: {
    textAlign: "center",
    marginTop: 4,
    color: Colors.PRIMARY,
  },
  title: {
    marginTop: 4,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
});

export default DisqualifiedPlaceholder;
