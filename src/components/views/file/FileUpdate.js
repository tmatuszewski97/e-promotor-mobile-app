import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  CustomDialog,
  CustomModalPicker,
  GradientButton,
  Loading,
  TitleWithData,
} from "../../shared";
import { getFileNameFromUrl } from "../../../scripts";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Colors } from "../../../styles";
import { FileServices } from "../../../services";

const FileUpdate = ({ navigation, route }) => {
  const { fileId } = route.params;
  const { state } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [sharedFor, setSharedFor] = useState("");
  const [gettingData, setGettingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileUpdatedDialog, setFileUpdatedDialog] = useState(null);

  const getData = () => {
    FileServices.getFileDetail(state.token, fileId)
      .then((response) => {
        setFile(response);
        setSharedFor(response.shared_for);
      })
      .catch((error) => {
        //console.log(error);
        setFile(null);
      })
      .finally(() => {
        setGettingData(false);
      });
  };

  const handleOnPressSave = () => {
    setLoading(true);
    FileServices.updateFile(state.token, file.id, sharedFor)
      .then((response) => {
        setFileUpdatedDialog(true);
      })
      .catch((error) => {
        //console.log(error);
        setFileUpdatedDialog(false);
      })
      .finally(() => {
        setLoading(false);
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

  return gettingData || loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <CustomDialog
        visible={fileUpdatedDialog}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Dane pliku zostały pomyślnie zaktualizowane.`}
        title={`Edycja zakończona powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("FileDetail", {
            fileId: file.id,
          });
        }}
      />
      <CustomDialog
        visible={fileUpdatedDialog === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Dane pliku nie zostały zaktualizowane. Być może obecnie nie jest on dostępny. Zostaniesz przeniesiony do listy plików.`}
        title={`Edycja zakończona niepowodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("FileList");
        }}
      />
      {!file ? (
        <CustomDialog
          visible={!file}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie można pobrać szczegółowych informacji o pliku. Być może został on usunięty. Zostaniesz przeniesiony do listy plików.`}
          title={`Błąd pobierania danych`}
          onPressConfirm={() => {
            navigation.navigate("FileList");
          }}
        />
      ) : (
        <View>
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons
              name={`file-edit-outline`}
              color={Colors.PRIMARY}
              size={40}
            />
            <Text style={styles.title}>{getFileNameFromUrl(file.file)}</Text>
          </View>
          <View>
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
                    setSharedFor(option.key);
                  }}
                  selectedKey={sharedFor}
                />
              }
              title={`Grupa odbiorcza`}
            />
          </View>
          <GradientButton
            fontSize={12}
            onPress={handleOnPressSave}
            text={`Zapisz zmiany`}
            style={{ width: 150, marginTop: 10, alignSelf: "center" }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  headerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: Colors.PRIMARY,
    textAlign: "center",
  },
});

export default FileUpdate;
