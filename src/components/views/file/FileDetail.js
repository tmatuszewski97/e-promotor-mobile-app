import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  CustomDialog,
  DownloadFileButton,
  Header,
  Loading,
  TitleWithData,
} from "../../shared";
import {
  capitalizeText,
  getFileNameFromUrl,
  getFormattedDate,
} from "../../../scripts";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Colors } from "../../../styles";
import { FileServices } from "../../../services";

const FileDetail = ({ navigation, route }) => {
  const defaultDialogsVisibilityState = {
    confirmDeletion: false,
    fileDeleted: null,
  };

  const { fileId } = route.params;
  const { state } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });

  const handleOnPressDelete = () => {
    setDialogsVisibility({ ...dialogsVisibility, confirmDeletion: true });
  };

  const handleOnPressEdit = () => {
    navigation.navigate("FileUpdate", {
      fileId: file.id,
    });
  };

  const handleDeleteFile = () => {
    setLoading(true);
    FileServices.deleteFile(state.token, file.id)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          confirmDeletion: false,
          fileDeleted: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({ ...dialogsVisibility, fileDeleted: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const headerIconsWithProps = [
    {
      iconName: `file-document-edit`,
      iconLabel: `Edytuj`,
      onPress: handleOnPressEdit,
    },
    {
      iconName: `delete`,
      iconLabel: `Usuń`,
      onPress: handleOnPressDelete,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleContainerStyle: {
        width: "50%",
      },
      title: file ? getFileNameFromUrl(file.file) : null,
      headerRight: () => {
        if (file && state.user.email === file.creator.email) {
          return <Header iconsWithProps={headerIconsWithProps} />;
        }
      },
    });
  }, [navigation, file]);

  const getData = () => {
    FileServices.getFileDetail(state.token, fileId)
      .then((response) => {
        setFile(response);
      })
      .catch((error) => {
        //console.log(error);
        setFile(null);
      })
      .finally(() => {
        setGettingData(false);
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
        visible={dialogsVisibility.confirmDeletion}
        dismissable={false}
        dialogType={`Confirmation`}
        text={`Po zatwierdzeniu, plik zostanie nieodwracalnie usunięty.\nCzy chcesz kontynuować?`}
        title={`Ważna informacja`}
        onPressCancel={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            confirmDeletion: false,
          });
        }}
        onPressConfirm={handleDeleteFile}
      />
      <CustomDialog
        visible={dialogsVisibility.fileDeleted}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Plik został pomyślnie usunięty. Zostaniesz przeniesiony do listy plików.`}
        title={`Usuwanie zakończone powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("FileList");
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.fileDeleted === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Plik nie został usunięty. Być może obecnie nie jest on dostępny. Zostaniesz przeniesiony do listy plików.`}
        title={`Usuwanie zakończone niepowodzeniem`}
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
              name={`file-outline`}
              color={Colors.PRIMARY}
              size={40}
            />
            <Text style={styles.title}>{getFileNameFromUrl(file.file)}</Text>
          </View>
          <View>
            <TitleWithData
              dataComponent={
                <Text style={styles.text}>
                  {file.creator.first_name + ` ` + file.creator.last_name}
                </Text>
              }
              title={`Twórca`}
            />
            <TitleWithData
              dataComponent={
                <Text style={styles.text}>
                  {capitalizeText(file.shared_for)}
                </Text>
              }
              title={`Grupa odbiorcza`}
            />
            <TitleWithData
              dataComponent={
                <Text style={styles.text}>
                  {getFormattedDate(file.creation_date)}
                </Text>
              }
              title={`Data przesłania`}
            />
          </View>
          <DownloadFileButton
            file={file.file}
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
  text: {
    color: Colors.PRIMARY,
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

export default FileDetail;
