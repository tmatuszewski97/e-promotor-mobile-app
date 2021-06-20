import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles";
import CustomCard from "./CustomCard";

const PromoterProfile = ({ promoterData, ...props }) => {
  return (
    <View {...props}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.image}
          source={
            promoterData.image != null
              ? { uri: promoterData.image }
              : require("../../assets/images/blank_profile_picture.png")
          }
        />
        <Text style={styles.headerText}>
          {promoterData.title +
            " " +
            promoterData.user.first_name +
            " " +
            promoterData.user.last_name}
        </Text>
      </View>
      {promoterData.proposed_topics ? (
        <CustomCard
          style={{
            borderColor: Colors.GREEN,
          }}
          iconName={`checkbox-marked-circle-outline`}
          iconColor={Colors.GREEN}
          titleText={`Proponowane tematy`}
          titleColor={Colors.GREEN}
          bodyComponent={
            <Text style={styles.cardText}>{promoterData.proposed_topics}</Text>
          }
        />
      ) : null}
      {promoterData.unwanted_topics ? (
        <CustomCard
          style={{ borderColor: Colors.RED }}
          iconName={`minus-circle-outline`}
          iconColor={Colors.RED}
          titleText={`Niechciane tematy`}
          titleColor={Colors.RED}
          bodyComponent={
            <Text style={styles.cardText}>{promoterData.unwanted_topics}</Text>
          }
        />
      ) : null}
      {promoterData.interests ? (
        <CustomCard
          style={{ borderColor: Colors.PRIMARY }}
          iconName={`brain`}
          iconColor={Colors.PRIMARY}
          titleText={`Zainteresowania`}
          titleColor={Colors.PRIMARY}
          bodyComponent={
            <Text style={styles.cardText}>{promoterData.interests}</Text>
          }
        />
      ) : null}
      {promoterData.contact ? (
        <CustomCard
          style={{ borderColor: Colors.PRIMARY }}
          iconName={`chat-outline`}
          iconColor={Colors.PRIMARY}
          titleText={`Kontakt`}
          titleColor={Colors.PRIMARY}
          bodyComponent={
            <Text style={styles.cardText}>{promoterData.contact}</Text>
          }
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardText: {
    color: Colors.PRIMARY,
  },
  headerContainer: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: Colors.PRIMARY,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 50,
  },
});

export default PromoterProfile;
