import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../styles";
import { HorizontalIconWithLabel } from "../../shared";

const ChooseUsersGroup = ({ navigation }) => {
  const handleOnPressDeanWorkers = () => {
    navigation.navigate("DeanWorkerList");
  };

  const handleOnPressPromoters = () => {
    navigation.navigate("PromoterList");
  };

  const handleOnPressStudents = () => {
    navigation.navigate("StudentList");
  };

  const usersGroupsWithProps = [
    {
      groupName: `Pracownicy dziekanatu`,
      iconName: `account-cog`,
      onPress: handleOnPressDeanWorkers,
    },
    {
      groupName: `Promotorzy`,
      iconName: `account-tie`,
      onPress: handleOnPressPromoters,
    },
    {
      groupName: `Studenci`,
      iconName: `school`,
      onPress: handleOnPressStudents,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.headerContainer}>
        <Text
          style={styles.headerTitle}
        >{`Którą grupą użytkowników chcesz zarządzać?`}</Text>
      </View>
      {usersGroupsWithProps.map((item, index) => {
        return (
          <HorizontalIconWithLabel
            key={index}
            iconName={item.iconName}
            iconSize={40}
            label={item.groupName}
            onPress={item.onPress}
            style={styles.listItemContainer}
          />
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 4,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  headerTitle: {
    textAlign: "center",
    color: Colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 16,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    padding: 10,
    borderColor: Colors.PRIMARY,
  },
});

export default ChooseUsersGroup;
