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
import { UserServices } from "../../../services";

const UserPromoterUpdate = ({ navigation }) => {
  const defaultDataState = {
    firstName: "",
    lastName: "",
    title: "",
    image: null,
    proposedTopics: "",
    unwantedTopics: "",
    interests: "",
    contact: "",
  };
  const defaultFormErrorsState = {
    invalidFirstName: false,
    invalidLastName: false,
  };
  const defaultDialogsVisibilityState = {
    invalidForm: false,
    userUpdated: null,
  };

  const { state, signOut } = useContext(AuthContext);
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
    UserServices.getUserDetail(state.token)
      .then((response) => {
        setPromoter(response);
        setData({
          ...data,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          title: response.title,
          image: response.image,
          proposedTopics: response.proposed_topics,
          unwantedTopics: response.unwanted_topics,
          interests: response.interests,
          contact: response.contact,
        });
      })
      .catch((error) => {
        setPromoter(null);
      })
      .finally(() => {
        setGettingData(false);
      });
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
    if (!formErrors.invalidFirstName && !formErrors.invalidLastName) {
      setLoading(true);
      UserServices.updatePromoterUser(state.token, data)
        .then((response) => {
          setPromoter(response);
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
      {!promoter ? (
        <CustomDialog
          visible={!promoter}
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
              error={formErrors.invalidFirstName}
              errorText={`Pole nie mo??e by?? puste i nie mo??e zawiera?? cyfr!`}
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
              title={`Imi??`}
            />
            <TitleWithData
              error={formErrors.invalidLastName}
              errorText={`Pole nie mo??e by?? puste i nie mo??e zawiera?? cyfr!`}
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
              title={`Tytu??`}
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
                          ? `Wybierz zdj??cie...`
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
              title={`Zdj??cie`}
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

export default UserPromoterUpdate;
