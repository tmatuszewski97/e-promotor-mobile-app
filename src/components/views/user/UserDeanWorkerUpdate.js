import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  CustomDialog,
  GradientButton,
  Loading,
  TitleWithData,
} from "../../shared";
import { Colors } from "../../../styles";
import { Validations } from "../../../scripts";
import { UserServices } from "../../../services";

const UserDeanWorkerUpdate = ({ navigation }) => {
  const defaultDataState = {
    email: "",
    firstName: "",
    lastName: "",
    contact: "",
  };
  const defaultFormErrorsState = {
    invalidEmail: false,
    invalidFirstName: false,
    invalidLastName: false,
  };
  const defaultDialogsVisibilityState = {
    invalidForm: false,
    userUpdated: null,
  };

  const { state, signOut } = useContext(AuthContext);
  const [deanWorker, setDeanWorker] = useState(null);
  const [gettingData, setGettingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ...defaultDataState });
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [formErrors, setFormErrors] = useState({
    ...defaultFormErrorsState,
  });

  const getData = () => {
    UserServices.getUserDetail(state.token)
      .then((response) => {
        setDeanWorker(response);
        setData({
          ...data,
          email: response.user.email,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          contact: response.contact,
        });
      })
      .catch((error) => {
        setDeanWorker(null);
      })
      .finally(() => {
        setGettingData(false);
      });
  };

  const handleOnChangeEmail = (value) => {
    setData({
      ...data,
      email: value,
    });
    if (!Validations.isValidEmail(value)) {
      setFormErrors({ ...formErrors, invalidEmail: true });
    } else {
      setFormErrors({ ...formErrors, invalidEmail: false });
    }
  };

  const handleOnChangeFirstName = (value) => {
    setData({
      ...data,
      firstName: value,
    });
    if (!Validations.isValidFirstOrLastName(value)) {
      setFormErrors({ ...formErrors, invalidFirstName: true });
    } else {
      setFormErrors({ ...formErrors, invalidFirstName: false });
    }
  };

  const handleOnChangeLastName = (value) => {
    setData({
      ...data,
      lastName: value,
    });
    if (!Validations.isValidFirstOrLastName(value)) {
      setFormErrors({ ...formErrors, invalidLastName: true });
    } else {
      setFormErrors({ ...formErrors, invalidLastName: false });
    }
  };

  const handleOnPressSave = () => {
    if (
      !formErrors.invalidFirstName &&
      !formErrors.invalidLastName &&
      !formErrors.invalidEmail
    ) {
      setLoading(true);
      UserServices.updateDeanWorkerUser(state.token, data)
        .then((response) => {
          setDeanWorker(response);
          setDialogsVisibility({ ...dialogsVisibility, userUpdated: true });
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({ ...dialogsVisibility, userUpdated: false });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDialogsVisibility({ ...dialogsVisibility, invalidForm: true });
    }
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

  return gettingData || loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <CustomDialog
        visible={dialogsVisibility.invalidForm}
        dismissable={false}
        dialogType={`Error`}
        text={`Niekt??re z p??l nie zosta??y w??a??ciwie wype??nione.`}
        title={`B????d formularza`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, invalidForm: false });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.userUpdated}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Dane u??ytkownika zosta??y pomy??lnie zaktualizowane.`}
        title={`Edycja zako??czona powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("UserDetail");
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.userUpdated === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Dane u??ytkownika nie mog??y zosta?? zaktualizowane.`}
        title={`Edycja zako??czona niepowodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("UserDetail");
        }}
      />
      {!deanWorker ? (
        <CustomDialog
          visible={!deanWorker}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie mo??na pobra?? szczeg????owych informacji o koncie. By?? mo??e zosta??o ono usuni??te. Zostaniesz wylogowany.`}
          title={`B????d pobierania danych`}
          onPressConfirm={() => {
            signOut();
          }}
        />
      ) : (
        <ScrollView>
          <View style={styles.scrollViewContainer}>
            <TitleWithData
              error={formErrors.invalidEmail}
              errorText={`Email ma niepoprawn?? struktur??`}
              dataComponent={
                <TextInput
                  keyboardType="email-address"
                  defaultValue={deanWorker.user.email}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  onChangeText={(value) => {
                    handleOnChangeEmail(value);
                  }}
                />
              }
              title={`Adres email`}
            />
            <TitleWithData
              error={formErrors.invalidFirstName}
              errorText={`Pole nie mo??e by?? puste i nie mo??e zawiera?? cyfr!`}
              dataComponent={
                <TextInput
                  defaultValue={deanWorker.user.first_name}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  onChangeText={(value) => {
                    handleOnChangeFirstName(value);
                  }}
                />
              }
              title={`Imi??`}
            />
            <TitleWithData
              error={formErrors.invalidLastName}
              errorText={`Pole nie mo??e by?? puste i nie mo??e zawiera?? cyfr!`}
              dataComponent={
                <TextInput
                  defaultValue={deanWorker.user.last_name}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  onChangeText={(value) => {
                    handleOnChangeLastName(value);
                  }}
                />
              }
              title={`Nazwisko`}
            />
            <TitleWithData
              dataComponent={
                <TextInput
                  defaultValue={deanWorker.contact}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  multiline={true}
                  onChangeText={(value) => {
                    setData({
                      ...data,
                      contact: value,
                    });
                  }}
                />
              }
              title={`Kontakt`}
            />
            <GradientButton
              fontSize={12}
              onPress={handleOnPressSave}
              text={`Zapisz zmiany`}
              style={{ width: 150, marginTop: 10, alignSelf: "center" }}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default UserDeanWorkerUpdate;
