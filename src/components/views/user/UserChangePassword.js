import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDialog,
  GradientButton,
  Loading,
  PasswordTextInput,
  TitleWithData,
} from "../../shared";
import { UserServices } from "../../../services";
import { Validations } from "../../../scripts";

const UserChangePassword = ({ navigation }) => {
  const defaultDataState = {
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  };
  const defaultFormErrorsState = {
    oldPasswordTooShort: false,
    newPasswordTooShort: false,
    newPassword2TooShort: false,
  };
  const defaultDialogsVisibilityState = {
    newPasswordsNotMatch: false,
    emptyForm: false,
    badForm: false,
    passwordChanged: null,
  };

  const { state, signOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ...defaultDataState });
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [formErrors, setFormErrors] = useState({
    ...defaultFormErrorsState,
  });

  const handleOnChangeOldPassword = (value) => {
    setData({
      ...data,
      oldPassword: value,
    });
    if (!Validations.isValidPassword(value)) {
      setFormErrors({ ...formErrors, oldPasswordTooShort: true });
    } else {
      setFormErrors({ ...formErrors, oldPasswordTooShort: false });
    }
  };

  const handleOnChangeNewPassword = (value) => {
    setData({
      ...data,
      newPassword: value,
    });
    if (!Validations.isValidPassword(value)) {
      setFormErrors({ ...formErrors, newPasswordTooShort: true });
    } else {
      setFormErrors({ ...formErrors, newPasswordTooShort: false });
    }
  };

  const handleOnChangeNewPassword2 = (value) => {
    setData({
      ...data,
      newPassword2: value,
    });
    if (!Validations.isValidPassword(value)) {
      setFormErrors({ ...formErrors, newPassword2TooShort: true });
    } else {
      setFormErrors({ ...formErrors, newPassword2TooShort: false });
    }
  };

  const handleOnPressSave = () => {
    if (
      data.oldPassword.trim().length === 0 ||
      data.newPassword.trim().length === 0 ||
      data.newPassword2.trim().length === 0
    ) {
      setDialogsVisibility({ ...dialogsVisibility, emptyForm: true });
    } else if (
      formErrors.oldPasswordTooShort ||
      formErrors.newPasswordTooShort ||
      formErrors.newPassword2TooShort
    ) {
      setDialogsVisibility({ ...dialogsVisibility, badForm: true });
    } else if (data.newPassword !== data.newPassword2) {
      setDialogsVisibility({
        ...dialogsVisibility,
        newPasswordsNotMatch: true,
      });
    } else {
      setLoading(true);
      UserServices.changePassword(state.token, data)
        .then((response) => {
          setDialogsVisibility({ ...dialogsVisibility, passwordChanged: true });
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({
            ...dialogsVisibility,
            passwordChanged: false,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <CustomDialog
        visible={dialogsVisibility.emptyForm}
        dismissable={false}
        dialogType={`Error`}
        text={"Przesyłane dane nie mogą być puste."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({ ...dialogsVisibility, emptyForm: false })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.badForm}
        dismissable={false}
        dialogType={`Error`}
        text={"Warunki dla poszczególnych pól nie są spełnione."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({ ...dialogsVisibility, badForm: false })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.newPasswordsNotMatch}
        dismissable={false}
        dialogType={`Error`}
        text={"Nowe hasła nie są ze sobą zgodne."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({
            ...dialogsVisibility,
            newPasswordsNotMatch: false,
          })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.passwordChanged}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Hasło zostało pomyślnie zmienione. Zostaniesz wylogowany.`}
        title={`Edycja zakończona powodzeniem`}
        onPressConfirm={() => {
          signOut();
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.passwordChanged === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Hasło nie mogło zostać zmienione.`}
        title={`Edycja zakończona niepowodzeniem`}
        onPressConfirm={() => {
          setData({ ...defaultDataState });
          setFormErrors({ ...defaultFormErrorsState });
          setDialogsVisibility({ ...defaultDialogsVisibilityState });
        }}
      />
      <TitleWithData
        error={formErrors.oldPasswordTooShort}
        errorText={`Hasło musi zawierać przynajmniej 5 znaków`}
        dataComponent={
          <PasswordTextInput
            inputStyle={{ flex: 1 }}
            placeholder={`Wprowadź stare hasło...`}
            onChangeText={(value) => {
              handleOnChangeOldPassword(value);
            }}
          />
        }
        title={`Stare hasło`}
      />
      <TitleWithData
        error={formErrors.newPasswordTooShort}
        errorText={`Hasło musi zawierać przynajmniej 5 znaków`}
        dataComponent={
          <PasswordTextInput
            inputStyle={{ flex: 1 }}
            placeholder={`Wprowadź nowe hasło...`}
            onChangeText={(value) => {
              handleOnChangeNewPassword(value);
            }}
          />
        }
        title={`Nowe hasło`}
      />
      <TitleWithData
        error={formErrors.newPassword2TooShort}
        errorText={`Hasło musi zawierać przynajmniej 5 znaków`}
        dataComponent={
          <PasswordTextInput
            inputStyle={{ flex: 1 }}
            placeholder={`Jeszcze raz wprowadź nowe hasło...`}
            onChangeText={(value) => {
              handleOnChangeNewPassword2(value);
            }}
          />
        }
        title={`Potwierdzenie nowego hasła`}
      />
      <GradientButton
        fontSize={12}
        onPress={handleOnPressSave}
        text={`Zapisz zmiany`}
        style={{ width: 150, marginTop: 10, alignSelf: "center" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
});

export default UserChangePassword;
