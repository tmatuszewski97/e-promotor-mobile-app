import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../contexts";
import {
  CustomDialog,
  ElectionsInfoDialog,
  Header,
  Loading,
  Placeholder,
  RecordItemForDeanWorker,
  RoundButton,
} from "../../shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RecordServices } from "../../../services";
import { Colors } from "../../../styles";

const RecordListForDeanWorker = ({ navigation }) => {
  const defaultElectionsInfoState = {
    allStudentsNumber: 0,
    disqualifiedStudentsNumber: 0,
    chosenStudentsNumber: 0,
    electionsEnded: null,
    requestsSent: false,
    tourNumber: 0,
  };
  const defaultDialogsVisibilityState = {
    confirmDisqualification: false,
    disqualificationDone: null,
    fileCreated: null,
    showInfoDialog: null,
    electionsNotStartedDialog: false,
  };

  const { state } = useContext(AuthContext);
  const [electionsInfo, setElectionsInfo] = useState({
    ...defaultElectionsInfoState,
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });
  const [showButtons, setShowButtons] = useState(true);

  const handleOnStartScrolling = () => {
    setShowButtons(false);
  };

  const handleOnStopScrolling = () => {
    setShowButtons(true);
  };

  const handleOnPressDisqualifyStudents = () => {
    setDialogsVisibility({
      ...dialogsVisibility,
      confirmDisqualification: true,
    });
  };

  const handleOnPressExportToCsv = () => {
    setLoading(true);
    RecordServices.recordSummaryToCsv(state.token)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          fileCreated: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({
          ...dialogsVisibility,
          fileCreated: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDisqualifyStudents = () => {
    setLoading(true);
    RecordServices.revokeRecords(state.token)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          confirmDisqualification: false,
          disqualificationDone: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({
          ...dialogsVisibility,
          confirmDisqualification: false,
          disqualificationDone: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnPressCheckStatus = () => {
    RecordServices.getElectionsStatus(state.token)
      .then((response) => {
        setElectionsInfo({
          ...electionsInfo,
          allStudentsNumber: response.students_in_numbers.all_students,
          disqualifiedStudentsNumber:
            response.students_in_numbers.disqualified_students,
          chosenStudentsNumber: response.students_in_numbers.chosen_students,
          electionsEnded: response.elections_ended,
          requestsSent: response.requests_sent,
          tourNumber: response.tour_number,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({
          ...dialogsVisibility,
          electionsNotStartedDialog: true,
        });
        setElectionsInfo({ ...defaultElectionsInfoState });
      });
  };

  const handleOnPressHelp = () => {
    setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
  };

  const handleOnPressRefresh = () => {
    setGettingData(true);
  };

  const headerIconsWithProps = [
    {
      iconName: `podium`,
      iconLabel: `Status wyborów`,
      onPress: handleOnPressCheckStatus,
    },
    {
      iconName: `help-circle-outline`,
      iconLabel: `Pomoc`,
      onPress: handleOnPressHelp,
    },
    {
      iconName: `refresh`,
      iconLabel: `Odśwież`,
      onPress: handleOnPressRefresh,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Header iconsWithProps={headerIconsWithProps} />,
    });
  }, [navigation]);

  const getData = () => {
    RecordServices.getRecordSummary(state.token)
      .then((response) => {
        setRecords(response);
      })
      .catch((error) => {
        //console.log(error);
        setRecords([]);
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

  useEffect(() => {
    AsyncStorage.getItem("deanWorkerInformed").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("deanWorkerInformed", "true");
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
      } else {
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
      }
    });
  }, []);

  return gettingData || loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {records && !records.length ? <Placeholder /> : null}
      <CustomDialog
        visible={dialogsVisibility.showInfoDialog}
        dismissable={false}
        dialogType={`Information`}
        text={`Zakładka zawiera listę studentów wraz z przypisanymi im promotorami oraz studentów, którzy zostali zdyskwalifikowani w wyniku niewysłania na czas swoich próśb podczas trwania wyborów.\n\nPóki żaden student nie odnajdzie promotora lub nie zostanie zdyskwalifikowany, zakładka nie wyświetli żadnych kluczowych informacji.\n\nWarto kontrolować aktualny status wyborów za pomocą właściwej ikony na górze. Ponadto, wskazanym jest odświeżyć od czasu do czasu widok, aby pobrać aktualne dane.\n\nDodatkową opcją jest możliwość wspomnianej dyskwalifikacji studentów, jeśli są oni bierni i nie wysłali jeszcze swoich próśb do promotorów. Uwaga! Akcji tej nie można cofnąć (zdyskwalifikowany student nie może wziąć już ponownego udziału w wyborach) i można jej używać raz na daną turę. Akcja ma na celu zapobieganie zatrzymaniu się procesu wyborów przez pojedyncze jednostki.`}
        title={`Jakie informacje są tutaj przedstawione?`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.electionsNotStartedDialog}
        dismissable={false}
        dialogType={`Information`}
        text={`Wybory zostaną uruchomione wraz z zarejestrowaniem nowych studentów.`}
        title={`Proces wyborów jeszcze się nie zaczął`}
        onPressConfirm={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            electionsNotStartedDialog: false,
          });
        }}
      />
      <ElectionsInfoDialog
        electionsData={electionsInfo}
        onPressConfirm={() => {
          setElectionsInfo({ ...electionsInfo, electionsEnded: null });
        }}
        onDismiss={() => {
          setElectionsInfo({ ...electionsInfo, electionsEnded: null });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.confirmDisqualification}
        dismissable={false}
        dialogType={`Confirmation`}
        text={`Po zatwierdzeniu, studenci którzy nie wysłali jeszcze próśb do promotorów w tej turze, zostaną zdyskwalifikowani z całych wyborów.\nTej akcji nie można cofnąć.\nCzy chcesz kontynuować?`}
        title={`Ważna informacja`}
        onPressCancel={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            confirmDisqualification: false,
          });
        }}
        onPressConfirm={handleDisqualifyStudents}
      />
      <CustomDialog
        visible={dialogsVisibility.disqualificationDone}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Część studentów mogła zostać zdyskwalifikowana w wyniku tej akcji. Informacje o tym, kogo dotkął ten proces, znajdziesz w obecnym widoku.`}
        title={`Proces dyskwalifikacji zakończony powodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            disqualificationDone: null,
          });
          setGettingData(true);
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.disqualificationDone === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Nie można obecnie użyć tej akcji. Jest ona możliwa tylko raz w danej turze i tylko wtedy, gdy zawody trwają.`}
        title={`Proces dyskwalifikacji zakończony niepowodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            disqualificationDone: null,
          });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.fileCreated}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Plik .csv został wygenerowany i dodany do listy twoich plików. Zostaniesz do niej przeniesiony.`}
        title={`Proces eksportowania danych zakończony powodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            fileCreated: null,
          });
          navigation.navigate("FileStack");
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.fileCreated === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Plik z danymi nie mógł zostać wygenerowany.`}
        title={`Proces eksportowania danych zakończony niepowodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            fileCreated: null,
          });
        }}
      />
      <ScrollView
        onScrollBeginDrag={handleOnStartScrolling}
        onScrollEndDrag={handleOnStopScrolling}
      >
        <View style={styles.scrollViewContainer}>
          {records.map((item) => (
            <RecordItemForDeanWorker key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      {records.length > 0 ? (
        <RoundButton
          iconName={`file-export`}
          onPress={handleOnPressExportToCsv}
          style={{ backgroundColor: Colors.PRIMARY, bottom: 100, right: 20 }}
          visible={showButtons}
        />
      ) : null}
      <RoundButton
        iconName={`account-off`}
        onPress={handleOnPressDisqualifyStudents}
        style={{ backgroundColor: Colors.RED, bottom: 20, right: 20 }}
        visible={showButtons}
      />
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
});

export default RecordListForDeanWorker;
