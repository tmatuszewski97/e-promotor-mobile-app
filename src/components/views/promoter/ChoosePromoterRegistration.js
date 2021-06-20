import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../styles";
import { HorizontalIconWithLabel } from "../../shared";

const ChoosePromoterRegistration = ({ navigation }) => {
  const handleOnPressRegister = () => {
    navigation.navigate("PromoterRegister");
  };

  const handleOnPressBulkRegister = () => {
    navigation.navigate("PromoterBulkRegister");
  };

  const registrationMethodsWithProps = [
    {
      label: `Dodaj pojedynczego promotora`,
      iconName: `account-cog`,
      onPress: handleOnPressRegister,
    },
    {
      label: `Zaimportuj promotorów z pliku`,
      iconName: `account-multiple-plus`,
      onPress: handleOnPressBulkRegister,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{`Którą operację wybrać?`}</Text>
      </View>
      {registrationMethodsWithProps.map((item, index) => {
        return (
          <HorizontalIconWithLabel
            key={index}
            iconName={item.iconName}
            iconSize={40}
            label={item.label}
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

export default ChoosePromoterRegistration;
