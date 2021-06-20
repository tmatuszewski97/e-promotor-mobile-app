import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles";
import TitleWithData from "./TitleWithData";
import TitleWithLines from "./TitleWithLines";

const DeanWorkerProfile = ({ deanWorkerData, style, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <TitleWithLines title={`Profil pracownika dziekanatu`} />
      <View style={styles.bodyContainer}>
        <TitleWithData
          dataComponent={
            <Text style={styles.text}>{deanWorkerData.user.email}</Text>
          }
          title={`Adres email`}
        />
        <TitleWithData
          dataComponent={
            <Text style={styles.text}>
              {deanWorkerData.user.first_name +
                ` ` +
                deanWorkerData.user.last_name}
            </Text>
          }
          title={`Imię i nazwisko`}
        />
        {deanWorkerData.contact ? (
          <TitleWithData
            dataComponent={
              <Text style={styles.text}>{deanWorkerData.contact}</Text>
            }
            title={`Kontakt`}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: { paddingHorizontal: 4 },
  container: {
    paddingVertical: 4,
  },
  text: {
    color: Colors.PRIMARY,
  },
});

export default DeanWorkerProfile;
