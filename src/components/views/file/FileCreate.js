import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDialog,
  CustomModalPicker,
  GradientButton,
  Loading,
  TitleWithData,
} from "../../shared";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "../../../styles";
import { AuthContext } from "../../../contexts";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { FileServices } from "../../../services";

const FileCreate = ({ navigation }) => {
  const defaultDataState = {
    file: null,
    sharedFor: `tylko ja`,
  };
  const defaultDialogsVisibilityState = {
    fileUploaded: null,
    fileSelected: null,
  };
  const { state } = useContext(AuthContext);
  const [data, setData] = useState({
    ...defaultDataState,
  });
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [loading, setLoading] = useState(false);

  const handleOnPressFilePicker = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === `success`) {
      setData({ ...data, file: result });
    }
  };

  const handleOnPressSubmit = () => {
    if (data.file === null) {
      setDialogsVisibility({ ...dialogsVisibility, fileSelected: false });
      return;
    }
    setLoading(true);
    FileServices.createFile(state.token, data.file, data.sharedFor)
      .then((response) => {
        setDialogsVisibility({ ...dialogsVisibility, fileUploaded: true });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({ ...dialogsVisibility, fileUploaded: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name={data.file === null ? `file-remove` : `file-check`}
          color={data.file === null ? Colors.RED : Colors.GREEN}
          size={40}
        />
        <Text style={styles.title}>
          {data.file === null ? `Plik niewybrany` : `Plik wybrany`}
        </Text>
      </View>
      <CustomDialog
        visible={dialogsVisibility.fileSelected === false}
        dismissable={false}
        dialogType={`Error`}
        text={"Pola wyboru pliku nie może być puste."}
        title={"Błąd formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({ ...dialogsVisibility, fileSelected: null })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.fileUploaded === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Plik nie mógł zostać przesłany na serwer.`}
        title={`Dodawanie zakończone niepowodzeniem`}
        onPressConfirm={() => {
          setData({ ...defaultDataState });
          setDialogsVisibility({ ...defaultDialogsVisibilityState });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.fileUploaded}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Plik został pomyślnie przesłany na serwer.`}
        title={`Dodawanie zakończone powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("FileList");
        }}
      />
      <TitleWithData
        dataComponent={
          <TouchableOpacity onPress={handleOnPressFilePicker}>
            <Text style={styles.text}>
              {data.file === null ? `Wybierz plik...` : data.file.name}
            </Text>
          </TouchableOpacity>
        }
        title={`Plik`}
      />
      <TitleWithData
        dataComponent={
          <CustomModalPicker
            data={[
              { label: `Tylko ja`, key: `tylko ja` },
              {
                label: `Pracownicy dziekanatu`,
                key: `pracownicy dziekanatu`,
              },
              { label: `Promotorzy`, key: `promotorzy` },
              { label: `Studenci`, key: `studenci` },
            ]}
            onChange={(option) => {
              setData({ ...data, sharedFor: option.key });
            }}
            selectedKey={data.sharedFor}
          />
        }
        title={`Grupa odbiorcza`}
      />
      <GradientButton
        fontSize={12}
        onPress={handleOnPressSubmit}
        text={`Prześlij`}
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
  headerContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: Colors.PRIMARY,
    textAlign: "center",
  },
  text: {
    color: Colors.PRIMARY,
  },
});

export default FileCreate;
