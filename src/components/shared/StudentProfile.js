import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { capitalizeText } from "../../scripts";
import { Colors } from "../../styles";
import TitleWithData from "./TitleWithData";
import TitleWithLines from "./TitleWithLines";

const StudentProfile = ({ studentData, style, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <TitleWithLines title={`Profil studenta`} />
      <View style={styles.bodyContainer}>
        <TitleWithData
          dataComponent={
            <Text style={styles.text}>{studentData.user.email}</Text>
          }
          title={`Adres email`}
        />
        <TitleWithData
          dataComponent={
            <Text style={styles.text}>
              {studentData.user.first_name + ` ` + studentData.user.last_name}
            </Text>
          }
          title={`Imię i nazwisko`}
        />
        <TitleWithData
          dataComponent={<Text style={styles.text}>{studentData.index}</Text>}
          title={`Numer indeksu`}
        />
        <TitleWithData
          dataComponent={
            <Text style={styles.text}>{studentData.specialization}</Text>
          }
          title={`Specjalizacja`}
        />
        <TitleWithData
          dataComponent={
            <Text style={styles.text}>
              {capitalizeText(studentData.cycle_degree)}
            </Text>
          }
          title={`Stopień`}
        />
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

export default StudentProfile;
