import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { Colors } from "../../../styles";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Octicons } from "@expo/vector-icons";
import {
  CustomDialog,
  GradientButton,
  Loading,
  PasswordTextInput,
} from "../../shared";
import { AuthContext } from "../../../contexts";
import { Validations } from "../../../scripts";
import { AuthServices } from "../../../services";

function SignInView({ navigation }) {
  const defaultDataState = {
    email: "",
    password: "",
    checkIconEmail: false,
    isValidEmail: true,
    isValidPassword: true,
  };
  const defaultFormErrorsState = {
    invalidEmail: false,
    invalidPassword: false,
  };
  const defaultDialogsVisibilityState = {
    badForm: false,
    emptyField: false,
    wrongUser: false,
  };
  const { signIn } = useContext(AuthContext);
  const [data, setData] = useState({
    ...defaultDataState,
  });
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    ...defaultFormErrorsState,
  });

  const handleEmailChange = (value) => {
    if (Validations.isValidEmail(value)) {
      setData({
        ...data,
        email: value,
        checkIconEmail: true,
      });
      setFormErrors({ ...formErrors, invalidEmail: false });
    } else {
      setData({
        ...data,
        email: value,
        checkIconEmail: false,
      });
      setFormErrors({ ...formErrors, invalidEmail: true });
    }
  };

  const handlePasswordChange = (value) => {
    if (Validations.isValidPassword(value)) {
      setData({
        ...data,
        password: value,
      });
      setFormErrors({ ...formErrors, invalidPassword: false });
    } else {
      setData({
        ...data,
        password: value,
      });
      setFormErrors({ ...formErrors, invalidPassword: true });
    }
  };

  const handleLogin = (email, password) => {
    if (email.length === 0 || password.length === 0) {
      setDialogsVisibility({ ...dialogsVisibility, emptyField: true });
    } else if (formErrors.invalidEmail || formErrors.invalidPassword) {
      setDialogsVisibility({ ...dialogsVisibility, badForm: true });
    } else {
      setLoading(true);
      AuthServices.login(email, password)
        .then((response) => {
          signIn(response);
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({ ...dialogsVisibility, wrongUser: true });
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
        visible={dialogsVisibility.emptyField}
        dismissable={false}
        dialogType={`Error`}
        text={"Pola email i hasło nie mogą być puste."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({
            ...dialogsVisibility,
            emptyField: false,
          })
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
        visible={dialogsVisibility.wrongUser}
        dismissable={false}
        dialogType={`Error`}
        text={"Wprowadzono nieprawidłowy email lub hasło."}
        title={"Błąd logowania"}
        onPressConfirm={() =>
          setDialogsVisibility({ ...dialogsVisibility, wrongUser: false })
        }
      />
      <Animatable.View
        animation="bounceIn"
        duration={2000}
        style={styles.headerContainer}
      >
        <View style={styles.titleContainer}>
          <Octicons name="sign-in" size={50} color={Colors.WHITE} />
          <Text style={styles.title}>{`Logowanie`}</Text>
        </View>
      </Animatable.View>
      <Animatable.View animation="fadeInUpBig" style={styles.bodyContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.inputTitleText}>{`Email`}</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={25}
              color={Colors.PRIMARY}
            />
            <TextInput
              placeholder={`Wprowadź adres email...`}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              keyboardType="email-address"
              color={Colors.PRIMARY}
              style={styles.inputStyle}
              onChangeText={(value) => handleEmailChange(value)}
            />
            {data.checkIconEmail ? (
              <Animatable.View animation="bounceIn">
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={25}
                  color={Colors.PRIMARY}
                />
              </Animatable.View>
            ) : null}
          </View>
          {formErrors.invalidEmail ? (
            <Animatable.View animation="fadeInLeft">
              <Text style={styles.errorMessage}>
                {`Email ma niepoprawną strukturę`}
              </Text>
            </Animatable.View>
          ) : null}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.inputTitleText}>{`Hasło`}</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={25}
              color={Colors.PRIMARY}
            />
            <PasswordTextInput
              placeholder={`Wprowadź hasło...`}
              inputStyle={styles.inputStyle}
              containerStyle={{ flex: 1 }}
              onChangeText={(value) => handlePasswordChange(value)}
            />
          </View>
          {formErrors.invalidPassword ? (
            <Animatable.View animation="fadeInLeft">
              <Text style={styles.errorMessage}>
                {`Hasło musi zawierać przynajmniej 5 znaków`}
              </Text>
            </Animatable.View>
          ) : null}
        </View>
        <View style={styles.sectionContainer}>
          <GradientButton
            fontSize={16}
            text={`Zaloguj`}
            onPress={() => handleLogin(data.email, data.password)}
          />
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: Colors.SECONDARY,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
  },
  errorMessage: {
    fontSize: 12,
    color: Colors.RED,
    fontWeight: "bold",
  },
  headerContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.PRIMARY,
  },
  inputStyle: {
    marginHorizontal: 4,
    flex: 1,
  },
  inputTitleText: {
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    color: Colors.WHITE,
  },
  titleContainer: {
    position: "absolute",
    alignItems: "center",
    alignSelf: "center",
    bottom: 25,
  },
});

export default SignInView;
