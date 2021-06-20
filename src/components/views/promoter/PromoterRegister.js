import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDialog,
  CustomModalPicker,
  GradientButton,
  Loading,
  PasswordTextInput,
  TitleWithData,
} from "../../shared";
import { Colors } from "../../../styles";
import { PromoterServices } from "../../../services";
import { Validations } from "../../../scripts";

const PromoterRegister = ({ navigation }) => {
  const defaultDataState = {
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    title: `dr`,
    maxStudentsNumber: "",
  };
  const defaultFormErrorsState = {
    invalidEmail: false,
    invalidPassword: false,
    invalidPassword2: false,
    invalidFirstName: false,
    invalidLastName: false,
    invalidMaxStudentsNumber: false,
  };
  const defaultDialogsVisibilityState = {
    emptyForm: false,
    passwordsNotMatch: false,
    invalidForm: false,
    promoterRegistered: null,
  };

  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ...defaultDataState });
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [formErrors, setFormErrors] = useState({
    ...defaultFormErrorsState,
  });

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

  const handleOnChangePassword = (value) => {
    setData({
      ...data,
      password: value,
    });
    if (!Validations.isValidPassword(value)) {
      setFormErrors({ ...formErrors, invalidPassword: true });
    } else {
      setFormErrors({ ...formErrors, invalidPassword: false });
    }
  };

  const handleOnChangePassword2 = (value) => {
    setData({
      ...data,
      password2: value,
    });
    if (!Validations.isValidPassword(value)) {
      setFormErrors({ ...formErrors, invalidPassword2: true });
    } else {
      setFormErrors({ ...formErrors, invalidPassword2: false });
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

  const handleOnChangeMaxStudentsNumber = (value) => {
    setData({
      ...data,
      maxStudentsNumber: value,
    });
    if (!Validations.isPositiveNumber(value)) {
      setFormErrors({ ...formErrors, invalidMaxStudentsNumber: true });
    } else {
      setFormErrors({ ...formErrors, invalidMaxStudentsNumber: false });
    }
  };

  const handleOnPressSubmit = () => {
    if (
      data.email.trim().length === 0 ||
      data.password.trim().length === 0 ||
      data.password2.trim().length === 0 ||
      data.firstName.trim().length === 0 ||
      data.lastName.trim().length === 0 ||
      data.maxStudentsNumber.trim().length === 0
    ) {
      setDialogsVisibility({ ...dialogsVisibility, emptyForm: true });
    } else if (
      formErrors.invalidEmail ||
      formErrors.invalidPassword ||
      formErrors.invalidPassword2 ||
      formErrors.invalidFirstName ||
      formErrors.invalidLastName ||
      formErrors.invalidMaxStudentsNumber
    ) {
      setDialogsVisibility({ ...dialogsVisibility, invalidForm: true });
    } else if (data.password !== data.password2) {
      setDialogsVisibility({
        ...dialogsVisibility,
        passwordsNotMatch: true,
      });
    } else {
      setLoading(true);
      PromoterServices.registerPromoter(state.token, data)
        .then((response) => {
          setDialogsVisibility({
            ...dialogsVisibility,
            promoterRegistered: true,
          });
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({
            ...dialogsVisibility,
            promoterRegistered: false,
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
        visible={dialogsVisibility.invalidForm}
        dismissable={false}
        dialogType={`Error`}
        text={"Warunki dla poszczególnych pól nie są spełnione."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({ ...dialogsVisibility, invalidForm: false })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.passwordsNotMatch}
        dismissable={false}
        dialogType={`Error`}
        text={"Hasła nie są ze sobą zgodne."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({
            ...dialogsVisibility,
            passwordsNotMatch: false,
          })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.promoterRegistered}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Użytkownik został pomyślnie dodany do grona promotorów.`}
        title={`Rejestracja zakończona powodzeniem`}
        onPressConfirm={() => {
          navigation.goBack();
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.promoterRegistered === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Nie można było dodać nowego promotora.`}
        title={`Rejestracja zakończona niepowodzeniem`}
        onPressConfirm={() => {
          setData({ ...defaultDataState });
          setFormErrors({ ...defaultFormErrorsState });
          setDialogsVisibility({ ...defaultDialogsVisibilityState });
        }}
      />
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          <TitleWithData
            error={formErrors.invalidEmail}
            errorText={`Email ma niepoprawną strukturę`}
            dataComponent={
              <TextInput
                keyboardType="email-address"
                defaultValue={data.email}
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
            error={formErrors.invalidPassword}
            errorText={`Hasło musi zawierać przynajmniej 5 znaków`}
            dataComponent={
              <PasswordTextInput
                inputStyle={{ flex: 1 }}
                placeholder={`Wprowadź hasło...`}
                onChangeText={(value) => {
                  handleOnChangePassword(value);
                }}
              />
            }
            title={`Hasło`}
          />
          <TitleWithData
            error={formErrors.invalidPassword2}
            errorText={`Hasło musi zawierać przynajmniej 5 znaków`}
            dataComponent={
              <PasswordTextInput
                inputStyle={{ flex: 1 }}
                placeholder={`Jeszcze raz wprowadź hasło...`}
                onChangeText={(value) => {
                  handleOnChangePassword2(value);
                }}
              />
            }
            title={`Potwierdzenie nowego hasła`}
          />
          <TitleWithData
            error={formErrors.invalidFirstName}
            errorText={`Pole nie może być puste i nie może zawierać cyfr!`}
            dataComponent={
              <TextInput
                defaultValue={data.firstName}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                color={Colors.PRIMARY}
                style={styles.textInput}
                onChangeText={(value) => {
                  handleOnChangeFirstName(value);
                }}
              />
            }
            title={`Imię`}
          />
          <TitleWithData
            error={formErrors.invalidLastName}
            errorText={`Pole nie może być puste i nie może zawierać cyfr!`}
            dataComponent={
              <TextInput
                defaultValue={data.lastName}
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
              <CustomModalPicker
                data={[
                  {
                    label: `Prof. dr hab.`,
                    key: `prof. dr hab.`,
                  },
                  { label: `Dr hab.`, key: `dr hab.` },
                  { label: `Dr`, key: `dr` },
                ]}
                onChange={(option) => {
                  setData({
                    ...data,
                    title: option.key,
                  });
                }}
                selectedKey={data.title}
              />
            }
            title={`Tytuł`}
          />
          <TitleWithData
            error={formErrors.invalidMaxStudentsNumber}
            errorText={`Pole nie może być puste i musi zawierać tylko dodatnie cyfry!`}
            dataComponent={
              <TextInput
                defaultValue={data.maxStudentsNumber}
                keyboardType={`numeric`}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                color={Colors.PRIMARY}
                style={styles.textInput}
                onChangeText={(value) => {
                  handleOnChangeMaxStudentsNumber(value);
                }}
              />
            }
            title={`Maksymalna liczba studentów`}
          />
          <GradientButton
            fontSize={12}
            onPress={handleOnPressSubmit}
            text={`Zarejestruj użytkownika`}
            style={{ width: 150, marginTop: 10, alignSelf: "center" }}
          />
        </View>
      </ScrollView>
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

export default PromoterRegister;
