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
      iconLabel: `Status wybor??w`,
      onPress: handleOnPressCheckStatus,
    },
    {
      iconName: `help-circle-outline`,
      iconLabel: `Pomoc`,
      onPress: handleOnPressHelp,
    },
    {
      iconName: `refresh`,
      iconLabel: `Od??wie??`,
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
        text={`Zak??adka zawiera list?? student??w wraz z przypisanymi im promotorami oraz student??w, kt??rzy zostali zdyskwalifikowani w wyniku niewys??ania na czas swoich pr????b podczas trwania wybor??w.\n\nP??ki ??aden student nie odnajdzie promotora lub nie zostanie zdyskwalifikowany, zak??adka nie wy??wietli ??adnych kluczowych informacji.\n\nWarto kontrolowa?? aktualny status wybor??w za pomoc?? w??a??ciwej ikony na g??rze. Ponadto, wskazanym jest od??wie??y?? od czasu do czasu widok, aby pobra?? aktualne dane.\n\nDodatkow?? opcj?? jest mo??liwo???? wspomnianej dyskwalifikacji student??w, je??li s?? oni bierni i nie wys??ali jeszcze swoich pr????b do promotor??w. Uwaga! Akcji tej nie mo??na cofn???? (zdyskwalifikowany student nie mo??e wzi???? ju?? ponownego udzia??u w wyborach) i mo??na jej u??ywa?? raz na dan?? tur??. Akcja ma na celu zapobieganie zatrzymaniu si?? procesu wybor??w przez pojedyncze jednostki.`}
        title={`Jakie informacje s?? tutaj przedstawione?`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.electionsNotStartedDialog}
        dismissable={false}
        dialogType={`Information`}
        text={`Wybory zostan?? uruchomione wraz z zarejestrowaniem nowych student??w.`}
        title={`Proces wybor??w jeszcze si?? nie zacz????`}
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
        text={`Po zatwierdzeniu, studenci kt??rzy nie wys??ali jeszcze pr????b do promotor??w w tej turze, zostan?? zdyskwalifikowani z ca??ych wybor??w.\nTej akcji nie mo??na cofn????.\nCzy chcesz kontynuowa???`}
        title={`Wa??na informacja`}
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
        text={`Cz?????? student??w mog??a zosta?? zdyskwalifikowana w wyniku tej akcji. Informacje o tym, kogo dotk???? ten proces, znajdziesz w obecnym widoku.`}
        title={`Proces dyskwalifikacji zako??czony powodzeniem`}
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
        text={`Nie mo??na obecnie u??y?? tej akcji. Jest ona mo??liwa tylko raz w danej turze i tylko wtedy, gdy zawody trwaj??.`}
        title={`Proces dyskwalifikacji zako??czony niepowodzeniem`}
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
        text={`Plik .csv zosta?? wygenerowany i dodany do listy twoich plik??w. Zostaniesz do niej przeniesiony.`}
        title={`Proces eksportowania danych zako??czony powodzeniem`}
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
        text={`Plik z danymi nie m??g?? zosta?? wygenerowany.`}
        title={`Proces eksportowania danych zako??czony niepowodzeniem`}
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
