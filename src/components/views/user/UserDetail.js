import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ChooseComponentForUser,
  CustomDialog,
  DeanWorkerProfile,
  Header,
  Loading,
  PromoterProfile,
  StudentProfile,
} from "../../shared";
import { UserServices } from "../../../services";

const UserDetail = ({ navigation }) => {
  const { state, signOut } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [gettingData, setGettingData] = useState(true);

  const handleOnPressEdit = () => {
    navigation.navigate("UserUpdate");
  };

  const handleOnPressChangePassword = () => {
    navigation.navigate("UserChangePassword");
  };

  const handleOnPressLogout = () => {
    signOut();
  };

  const headerIconsWithProps = [
    {
      iconName: `account-edit`,
      iconLabel: `Edytuj profil`,
      onPress: handleOnPressEdit,
    },
    {
      iconName: `lock-reset`,
      iconLabel: `Zmień hasło`,
      onPress: handleOnPressChangePassword,
    },
    {
      iconName: `logout`,
      iconLabel: `Wyloguj`,
      onPress: handleOnPressLogout,
    },
  ];

  const headerIconsWithPropsForStudent = [
    {
      iconName: `lock-reset`,
      iconLabel: `Zmień hasło`,
      onPress: handleOnPressChangePassword,
    },
    {
      iconName: `logout`,
      iconLabel: `Wyloguj`,
      onPress: handleOnPressLogout,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleContainerStyle: {
        width: "50%",
      },
      headerRight: () => {
        return (
          <ChooseComponentForUser
            deanWorkerComponent={
              <Header iconsWithProps={headerIconsWithProps} />
            }
            promoterComponent={<Header iconsWithProps={headerIconsWithProps} />}
            studentComponent={
              <Header iconsWithProps={headerIconsWithPropsForStudent} />
            }
          />
        );
      },
    });
  }, [navigation]);

  const getData = () => {
    UserServices.getUserDetail(state.token)
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        //console.log(error);
        setUser(null);
      })
      .finally(() => {
        setGettingData(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      setGettingData(true);
    }, [])
  );

  useEffect(() => {
    if (gettingData) {
      getData();
    }
  }, [gettingData]);

  return gettingData ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {!user ? (
        <CustomDialog
          visible={!user}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie można pobrać szczegółowych informacji o koncie. Być może zostało ono usunięte. Zostaniesz wylogowany.`}
          title={`Błąd pobierania danych`}
          onPressConfirm={() => {
            signOut();
          }}
        />
      ) : (
        <ScrollView>
          <ChooseComponentForUser
            deanWorkerComponent={<DeanWorkerProfile deanWorkerData={user} />}
            promoterComponent={
              <PromoterProfile promoterData={user} style={{ padding: 4 }} />
            }
            studentComponent={<StudentProfile studentData={user} />}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserDetail;
