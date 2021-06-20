import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  CustomDialog,
  CustomModalPicker,
  GradientButton,
  Loading,
  TitleWithData,
} from "../../shared";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../../../styles";
import { getFileNameFromUrl, Validations } from "../../../scripts";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { PromoterServices } from "../../../services";

const PromoterUpdate = ({ route, navigation }) => {
  const defaultDataState = {
    email: "",
    firstName: "",
    lastName: "",
    title: "",
    image: null,
    proposedTopics: "",
    unwantedTopics: "",
    interests: "",
    contact: "",
    maxStudentsNumber: "",
  };
  const defaultFormErrorsState = {
    invalidEmail: false,
    invalidFirstName: false,
    invalidLastName: false,
    invalidMaxStudentsNumber: false,
  };
  const defaultDialogsVisibilityState = {
    invalidForm: false,
    promoterUpdated: null,
  };

  const { promoterId } = route.params;
  const { state } = useContext(AuthContext);
  const [promoter, setPromoter] = useState(null);
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
    PromoterServices.getPromoterDetail(state.token, promoterId)
      .then((response) => {
        setPromoter(response);
        setData({
          ...data,
          email: response.user.email,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          title: response.title,
          image: response.image,
          proposedTopics: response.proposed_topics,
          unwantedTopics: response.unwanted_topics,
          interests: response.interests,
          contact: response.contact,
          maxStudentsNumber: response.max_students_number,
        });
      })
      .catch((error) => {
        setPromoter(null);
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

  const handleOnPressImagePicker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setData({ ...data, image: result.uri });
      }
    }
  };

  const handleOnPressDeleteImage = () => {
    setData({ ...data, image: null });
  };

  const handleOnPressSave = () => {
    if (
      !formErrors.invalidEmail &&
      !formErrors.invalidFirstName &&
      !formErrors.invalidLastName &&
      !formErrors.invalidMaxStudentsNumber
    ) {
      setLoading(true);
      PromoterServices.updatePromoter(state.token, promoterId, data)
        .then((response) => {
          setPromoter(response);
          setDialogsVisibility({ ...dialogsVisibility, promoterUpdated: true });
        })
        .catch((error) => {
          //console.log(error);
          setDialogsVisibility({
            ...dialogsVisibility,
            promoterUpdated: false,
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
        visible={dialogsVisibility.promoterUpdated}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Dane promotora zostały pomyślnie zaktualizowane.`}
        title={`Edycja zakończona powodzeniem`}
        onPressConfirm={() => {
          navigation.goBack();
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.promoterUpdated === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Dane promotora nie mogły zostać zaktualizowane.`}
        title={`Edycja zakończona niepowodzeniem`}
        onPressConfirm={() => {
          navigation.goBack();
        }}
      />
      {!promoter ? (
        <CustomDialog
          visible={!promoter}
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
                  defaultValue={promoter.user.email}
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
                  defaultValue={promoter.user.first_name}
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
                  defaultValue={promoter.user.last_name}
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
              dataComponent={
                <TouchableOpacity onPress={handleOnPressImagePicker}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.text}>
                        {data.image === null
                          ? `Wybierz zdjęcie...`
                          : getFileNameFromUrl(data.image)}
                      </Text>
                    </View>
                    {data.image !== null ? (
                      <TouchableOpacity onPress={handleOnPressDeleteImage}>
                        <MaterialCommunityIcons
                          name={`image-off-outline`}
                          color={Colors.RED}
                          size={30}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </TouchableOpacity>
              }
              title={`Zdjęcie`}
            />
            <TitleWithData
              dataComponent={
                <TextInput
                  defaultValue={promoter.proposed_topics}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  multiline={true}
                  onChangeText={(value) => {
                    setData({
                      ...data,
                      proposedTopics: value,
                    });
                  }}
                />
              }
              title={`Proponowane tematy`}
            />
            <TitleWithData
              dataComponent={
                <TextInput
                  defaultValue={promoter.unwanted_topics}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  multiline={true}
                  onChangeText={(value) => {
                    setData({
                      ...data,
                      unwantedTopics: value,
                    });
                  }}
                />
              }
              title={`Niechciane tematy`}
            />
            <TitleWithData
              dataComponent={
                <TextInput
                  defaultValue={promoter.interests}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  color={Colors.PRIMARY}
                  style={styles.textInput}
                  multiline={true}
                  onChangeText={(value) => {
                    setData({
                      ...data,
                      interests: value,
                    });
                  }}
                />
              }
              title={`Zainteresowania`}
            />
            <TitleWithData
              dataComponent={
                <TextInput
                  defaultValue={promoter.contact}
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
            <TitleWithData
              error={formErrors.invalidMaxStudentsNumber}
              errorText={`Pole nie może być puste i musi zawierać tylko dodatnie cyfry!`}
              dataComponent={
                <TextInput
                  defaultValue={promoter.max_students_number.toString()}
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
  text: {
    color: Colors.PRIMARY,
  },
});

export default PromoterUpdate;
