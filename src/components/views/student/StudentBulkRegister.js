import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDialog,
  GradientButton,
  Header,
  Loading,
  TitleWithData,
} from "../../shared";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "../../../styles";
import { AuthContext } from "../../../contexts";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { StudentServices } from "../../../services";
import { wrongFileExtension } from "../../../scripts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentBulkRegister = ({ navigation }) => {
  const defaultDialogsVisibilityState = {
    fileSelected: null,
    studentsRegistered: null,
    wrongFileExtension: false,
    showInfoDialog: null,
  };
  const { state } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [loading, setLoading] = useState(false);

  const handleOnPressFilePicker = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === `success`) {
      setFile(result);
    }
  };

  const handleOnPressSubmit = () => {
    if (file === null) {
      setDialogsVisibility({ ...dialogsVisibility, fileSelected: false });
      return;
    }
    if (wrongFileExtension(file, "csv")) {
      setDialogsVisibility({ ...dialogsVisibility, wrongFileExtension: true });
      return;
    }
    setLoading(true);
    StudentServices.bulkRegisterStudent(state.token, file)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          studentsRegistered: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({
          ...dialogsVisibility,
          studentsRegistered: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnPressHelp = () => {
    setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
  };

  const headerIconsWithProps = [
    {
      iconName: `help-circle-outline`,
      iconLabel: `Pomoc`,
      onPress: handleOnPressHelp,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <Header iconsWithProps={headerIconsWithProps} />;
      },
    });
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem("csvStudents").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("csvStudents", "true");
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
      } else {
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
      }
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name={wrongFileExtension(file, "csv") ? `file-remove` : `file-check`}
          color={wrongFileExtension(file, "csv") ? Colors.RED : Colors.GREEN}
          size={40}
        />
        <Text style={styles.title}>
          {wrongFileExtension(file, "csv")
            ? `Plik .csv niewybrany`
            : `Plik .csv wybrany`}
        </Text>
      </View>
      <CustomDialog
        visible={dialogsVisibility.showInfoDialog}
        dismissable={false}
        dialogType={`Information`}
        text={`Struktura pliku z danymi studentów musi zgadzać się z poniższymi wytycznymi:\n\n1. Plik z rozszerzeniem .csv.\n2. Plik zawiera 5 kolumn: "indeks", "imię", "nazwisko", "stopień", "specjalizacja" (nazwy kolumn dowolne, liczy się ich kolejność i sens danych).\n3. Wartości poszczególnych kolumn nie mogą być puste.\n4. Pierwsza kolumna (indeks) musi się składać z 6 cyfr.\n5. Czwarta kolumna (stopień) przyjmuje tylko wartości "pierwszy" lub "drugi".\n6. Nie stosuj znaków nowych linii, apostrofów oraz cudzysłowów w treści dokumentu, gdyż może to zaburzyć odczyt danych z pliku.\n\nPo poprawnym zaimportowaniu danych, trzeba wiedzieć, że:\n\n1. Adres email studenta to "numer_indeksu@uwm.pl".\n2. Hasło do konta studenta to "$ + 3 pierwsze litery imienia + 3 pierwsze litery nazwiska + 3 ostatnie cyfry numeru indeksu" (całość bez polskich znaków z uwzględnieniem wielkich liter rozpoczynających imię i nazwisko).`}
        title={`Jak poprawnie zaimportować plik?`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
        }}
      />
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
        visible={dialogsVisibility.wrongFileExtension}
        dismissable={false}
        dialogType={`Error`}
        text={
          "Plik z którego będą importowane dane musi mieć rozszerzenie .csv."
        }
        title={"Błędne rozszerzenie pliku"}
        onPressConfirm={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            wrongFileExtension: false,
          });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentsRegistered === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Nowi studenci nie mogli zostać dodani na podstawie zamieszczonego pliku.\nSprawdź czy struktura pliku jest zgodna z wytycznymi i spróbuj ponownie.`}
        title={`Rejestracja zakończona niepowodzeniem`}
        onPressConfirm={() => {
          setFile(null);
          setDialogsVisibility({ ...defaultDialogsVisibilityState });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentsRegistered}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Nowi użytkownicy zostali poprawnie dodani do grona studentów. Dane dostępowe do kont są generowane na następującej zasadzie:\n\nAdres email studenta to "numer_indeksu@uwm.pl".\nPrzykład:\nStudent o indeksie 145123 otrzyma email: "145123@uwm.pl".\n\nHasło do konta studenta to "$" + 3 pierwsze litery imienia + 3 pierwsze litery nazwiska + 3 ostatnie cyfry numeru indeksu (całość bez polskich znaków z uwzględnieniem wielkich liter rozpoczynających imię i nazwisko).\nPrzykład:\nStudent Alicja Łyżka o indeksie: 123456, otrzyma hasło: "$AliLyz456".`}
        title={`Rejestracja zakończona powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("StudentList");
        }}
      />
      <TitleWithData
        dataComponent={
          <TouchableOpacity onPress={handleOnPressFilePicker}>
            <Text style={styles.text}>
              {file === null ? `Wybierz plik...` : file.name}
            </Text>
          </TouchableOpacity>
        }
        title={`Plik`}
      />
      <GradientButton
        fontSize={12}
        onPress={handleOnPressSubmit}
        text={`Zarejestruj studentów`}
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

export default StudentBulkRegister;
