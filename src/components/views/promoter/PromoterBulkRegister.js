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
import { PromoterServices } from "../../../services";
import { wrongFileExtension } from "../../../scripts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PromoterBulkRegister = ({ navigation }) => {
  const defaultDialogsVisibilityState = {
    fileSelected: null,
    promotersRegistered: null,
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
    PromoterServices.bulkRegisterPromoter(state.token, file)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          promotersRegistered: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({
          ...dialogsVisibility,
          promotersRegistered: false,
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
    AsyncStorage.getItem("csvPromoters").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("csvPromoters", "true");
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
        text={`Struktura pliku z danymi promotor??w musi zgadza?? si?? z poni??szymi wytycznymi:\n\n1. Plik z rozszerzeniem .csv.\n2. Plik zawiera 5 kolumn: "ci??g znak??w", "imi??", "nazwisko", "tytu??", "maksymalna liczba student??w", "proponowane tematyki", "niechciane tematyki", "zainteresowania", "kontakt" (nazwy kolumn dowolne, liczy si?? ich kolejno???? i sens danych).\n3. Warto??ci kolumn "imi??", "nazwisko", "tytu??", "maksymalna liczba student??w" nie mog?? by?? puste.\n4. Pierwsza kolumna (ci??g znak??w) ma na celu rozszerzy?? has??o do konta o dodatkowy tekst. Mo??na tam wpisa?? dowolne znaki lub pole pozostawi?? puste.\n5. Czwarta kolumna (tytu??) przyjmuje tylko warto??ci "dr", "dr hab.", lub "prof. dr hab.".\n6. Pi??ta kolumna okre??la ilu maksymalnie student??w mo??e zapisa?? si?? do danego promotora. Przyjmuje tylko warto??ci liczbowe.\n7. Nie stosuj znak??w nowych linii, apostrof??w oraz cudzys??ow??w w tre??ci dokumentu, gdy?? mo??e to zaburzy?? odczyt danych z pliku.\n\nPo poprawnym zaimportowaniu danych, trzeba wiedzie??, ??e:\n\n1. Adres email promotora to "pierwsza litera imienia + nazwisko + @uwm.pl" (ca??o???? bez polskich znak??w, wszystkie litery ma??e).\n2. Has??o do konta promotora to "nazwisko + @ + dodatkowy ci??g znak??w z pliku" (nazwisko bez polskich znak??w z uwzgl??dnieniem wielkich liter je rozpoczynaj??cych).`}
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
        visible={dialogsVisibility.promotersRegistered === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Nowi promotorzy nie mogli zosta?? dodani na podstawie zamieszczonego pliku.\nSprawd?? czy struktura pliku jest zgodna z wytycznymi i spr??buj ponownie.`}
        title={`Rejestracja zako??czona niepowodzeniem`}
        onPressConfirm={() => {
          setFile(null);
          setDialogsVisibility({ ...defaultDialogsVisibilityState });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.promotersRegistered}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Nowi u??ytkownicy zostali poprawnie dodani do grona promotor??w. Dane dost??powe do kont s?? generowane na nast??puj??cej zasadzie:\n\nAdres email promotora to "pierwsza litera imienia + nazwisko + @uwm.pl" (ca??o???? bez polskich znak??w, wszystkie litery ma??e).\nPrzyk??ad:\nPromotor ??ukasz G??owacki otrzyma email: "lglowacki@uwm.pl".\n\nHas??o do konta promotora to "nazwisko + @ + dodatkowy ci??g znak??w z pliku" (nazwisko bez polskich znak??w z uwzgl??dnieniem wielkich liter je rozpoczynaj??cych).\nPrzyk??ad:\nPromotor Alicja ??y??ka z warto??ci?? kolumny ci??g znak??w jako "12$", otrzyma has??o: "Lyzka@12$".`}
        title={`Rejestracja zako??czona powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("PromoterList");
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
        text={`Zarejestruj promotor??w`}
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

export default PromoterBulkRegister;
