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
        text={`Struktura pliku z danymi student??w musi zgadza?? si?? z poni??szymi wytycznymi:\n\n1. Plik z rozszerzeniem .csv.\n2. Plik zawiera 5 kolumn: "indeks", "imi??", "nazwisko", "stopie??", "specjalizacja" (nazwy kolumn dowolne, liczy si?? ich kolejno???? i sens danych).\n3. Warto??ci poszczeg??lnych kolumn nie mog?? by?? puste.\n4. Pierwsza kolumna (indeks) musi si?? sk??ada?? z 6 cyfr.\n5. Czwarta kolumna (stopie??) przyjmuje tylko warto??ci "pierwszy" lub "drugi".\n6. Nie stosuj znak??w nowych linii, apostrof??w oraz cudzys??ow??w w tre??ci dokumentu, gdy?? mo??e to zaburzy?? odczyt danych z pliku.\n\nPo poprawnym zaimportowaniu danych, trzeba wiedzie??, ??e:\n\n1. Adres email studenta to "numer_indeksu@uwm.pl".\n2. Has??o do konta studenta to "$ + 3 pierwsze litery imienia + 3 pierwsze litery nazwiska + 3 ostatnie cyfry numeru indeksu" (ca??o???? bez polskich znak??w z uwzgl??dnieniem wielkich liter rozpoczynaj??cych imi?? i nazwisko).`}
        title={`Jak poprawnie zaimportowa?? plik?`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.fileSelected === false}
        dismissable={false}
        dialogType={`Error`}
        text={"Pola wyboru pliku nie mo??e by?? puste."}
        title={"B????d formularza"}
        onPressConfirm={() =>
          setDialogsVisibility({ ...dialogsVisibility, fileSelected: null })
        }
      />
      <CustomDialog
        visible={dialogsVisibility.wrongFileExtension}
        dismissable={false}
        dialogType={`Error`}
        text={
          "Plik z kt??rego b??d?? importowane dane musi mie?? rozszerzenie .csv."
        }
        title={"B????dne rozszerzenie pliku"}
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
        text={`Nowi studenci nie mogli zosta?? dodani na podstawie zamieszczonego pliku.\nSprawd?? czy struktura pliku jest zgodna z wytycznymi i spr??buj ponownie.`}
        title={`Rejestracja zako??czona niepowodzeniem`}
        onPressConfirm={() => {
          setFile(null);
          setDialogsVisibility({ ...defaultDialogsVisibilityState });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentsRegistered}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Nowi u??ytkownicy zostali poprawnie dodani do grona student??w. Dane dost??powe do kont s?? generowane na nast??puj??cej zasadzie:\n\nAdres email studenta to "numer_indeksu@uwm.pl".\nPrzyk??ad:\nStudent o indeksie 145123 otrzyma email: "145123@uwm.pl".\n\nHas??o do konta studenta to "$" + 3 pierwsze litery imienia + 3 pierwsze litery nazwiska + 3 ostatnie cyfry numeru indeksu (ca??o???? bez polskich znak??w z uwzgl??dnieniem wielkich liter rozpoczynaj??cych imi?? i nazwisko).\nPrzyk??ad:\nStudent Alicja ??y??ka o indeksie: 123456, otrzyma has??o: "$AliLyz456".`}
        title={`Rejestracja zako??czona powodzeniem`}
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
        text={`Zarejestruj student??w`}
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
