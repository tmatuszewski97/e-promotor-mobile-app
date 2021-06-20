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
import { StudentServices } from "../../../services";
import { Validations } from "../../../scripts";

const StudentRegister = ({ navigation }) => {
  const defaultDataState = {
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    index: "",
    cycleDegree: "pierwszy",
    specialization: "",
  };
  const defaultFormErrorsState = {
    invalidEmail: false,
    invalidPassword: false,
    invalidPassword2: false,
    invalidFirstName: false,
    invalidLastName: false,
    invalidIndex: false,
    invalidSpecialization: false,
  };
  const defaultDialogsVisibilityState = {
    emptyForm: false,
    passwordsNotMatch: false,
    invalidForm: false,
    studentRegistered: null,
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

  const handleOnChangeIndex = (value) => {
    setData({
      ...data,
      index: value,
    });
    if (!Validations.isValidIndex(value)) {
      setFormErrors({ ...formErrors, invalidIndex: true });
    } else {
      setFormErrors({ ...formErrors, invalidIndex: false });
    }
  };

  const handleOnChangeSpecialization = (value) => {
    setData({
      ...data,
      specialization: value,
    });
    if (!Validations.isValidSpecialization(value)) {
      setFormErrors({ ...formErrors, invalidSpecialization: true });
    } else {
      setFormErrors({ ...formErrors, invalidSpecialization: false });
    }
  };

  const handleOnPressSubmit = () => {
    if (
      data.email.trim().length === 0 ||
      data.password.trim().length === 0 ||
      data.password2.trim().length === 0 ||
      data.firstName.trim().length === 0 ||
      data.lastName.trim().length === 0 ||
      data.index.trim().length === 0 ||
      data.specialization.trim().length === 0
    ) {
      setDialogsVisibility({ ...dialogsVisibility, emptyForm: true });
    } else if (
      formErrors.invalidEmail ||
      formErrors.invalidPassword ||
      formErrors.invalidPassword2 ||
      formErrors.invalidFirstName ||
      formErrors.invalidLastName ||
      formErrors.invalidIndex ||
      formErrors.invalidSpecialization
    ) {
      setDialogsVisibility({ ...dialogsVisibility, invalidForm: true });
    } else if (data.password !== data.password2) {
      setDialogsVisibility({
        ...dialogsVisibility,
        passwordsNotMatch: true,
      });
    } else {
      setLoading(true);
      StudentServices.registerStudent(state.token, data)
        .then((response) => {
          setDialogsVisibility({
            ...dialogsVisibility,
            studentRegistered: true,
          });
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({
            ...dialogsVisibility,
            studentRegistered: false,
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
        visible={dialogsVisibility.studentRegistered}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Użytkownik został pomyślnie dodany do grona studentów.`}
        title={`Rejestracja zakończona powodzeniem`}
        onPressConfirm={() => {
          navigation.goBack();
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentRegistered === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Nie można było dodać nowego studenta.`}
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
            error={formErrors.invalidIndex}
            errorText={`Pole musi składać się z 6 cyfr!`}
            dataComponent={
              <TextInput
                defaultValue={data.index}
                keyboardType={`numeric`}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                color={Colors.PRIMARY}
                style={styles.textInput}
                onChangeText={(value) => {
                  handleOnChangeIndex(value);
                }}
              />
            }
            title={`Numer indeksu`}
          />
          <TitleWithData
            dataComponent={
              <CustomModalPicker
                data={[
                  {
                    label: `Pierwszy`,
                    key: `pierwszy`,
                  },
                  { label: `Drugi`, key: `drugi` },
                ]}
                onChange={(option) => {
                  setData({
                    ...data,
                    cycleDegree: option.key,
                  });
                }}
                selectedKey={data.cycleDegree}
              />
            }
            title={`Stopień`}
          />
          <TitleWithData
            error={formErrors.invalidSpecialization}
            errorText={`Pole nie może być puste i nie może zawierać cyfr!`}
            dataComponent={
              <TextInput
                defaultValue={data.specialization}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                color={Colors.PRIMARY}
                style={styles.textInput}
                onChangeText={(value) => {
                  handleOnChangeSpecialization(value);
                }}
              />
            }
            title={`Specjalizacja`}
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

export default StudentRegister;
