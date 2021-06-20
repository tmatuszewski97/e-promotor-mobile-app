import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  CustomDialog,
  CustomModalPicker,
  GradientButton,
  Loading,
  TitleWithData,
} from "../../shared";
import { Colors } from "../../../styles";
import { StudentServices } from "../../../services";
import { Validations } from "../../../scripts";

const PromoterUpdate = ({ route, navigation }) => {
  const defaultDataState = {
    email: "",
    firstName: "",
    lastName: "",
    index: "",
    cycleDegree: "",
    specialization: "",
  };
  const defaultFormErrorsState = {
    invalidEmail: false,
    invalidFirstName: false,
    invalidLastName: false,
    invalidIndex: false,
    invalidSpecialization: false,
  };
  const defaultDialogsVisibilityState = {
    invalidForm: false,
    studentUpdated: null,
  };

  const { studentId } = route.params;
  const { state } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
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
    StudentServices.getStudentDetail(state.token, studentId)
      .then((response) => {
        setStudent(response);
        setData({
          ...data,
          email: response.user.email,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          index: response.index,
          cycleDegree: response.cycle_degree,
          specialization: response.specialization,
        });
      })
      .catch((error) => {
        setStudent(null);
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

  const handleOnPressSave = () => {
    if (
      !formErrors.invalidEmail &&
      !formErrors.invalidFirstName &&
      !formErrors.invalidLastName &&
      !formErrors.invalidIndex &&
      !formErrors.invalidSpecialization
    ) {
      setLoading(true);
      StudentServices.updateStudent(state.token, studentId, data)
        .then((response) => {
          setStudent(response);
          setDialogsVisibility({ ...dialogsVisibility, studentUpdated: true });
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({
            ...dialogsVisibility,
            studentUpdated: false,
          });
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
        text={`Niektóre z pól nie zostały właściwie wypełnione.`}
        title={`Błąd formularza`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, invalidForm: false });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentUpdated}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Dane studenta zostały pomyślnie zaktualizowane.`}
        title={`Edycja zakończona powodzeniem`}
        onPressConfirm={() => {
          navigation.goBack();
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentUpdated === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Dane studenta nie mogły zostać zaktualizowane.`}
        title={`Edycja zakończona niepowodzeniem`}
        onPressConfirm={() => {
          navigation.goBack();
        }}
      />
      {!student ? (
        <CustomDialog
          visible={!student}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie można pobrać szczegółowych informacji o koncie. Być może zostało ono usunięte.`}
          title={`Błąd pobierania danych`}
          onPressConfirm={() => {
            navigation.goBack();
          }}
        />
      ) : (
        <ScrollView>
          <View style={styles.scrollViewContainer}>
            <TitleWithData
              error={formErrors.invalidEmail}
              errorText={`Email ma niepoprawną strukturę`}
              dataComponent={
                <TextInput
                  keyboardType="email-address"
                  defaultValue={student.user.email}
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
              errorText={`Pole nie może być puste i nie może zawierać cyfr!`}
              dataComponent={
                <TextInput
                  defaultValue={student.user.first_name}
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
                  defaultValue={student.user.last_name}
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
                  defaultValue={student.index.toString()}
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
                  defaultValue={student.specialization}
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

export default PromoterUpdate;
