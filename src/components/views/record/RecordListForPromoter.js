import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../contexts";
import {
  CustomDialog,
  ElectionsInfoDialog,
  Header,
  HideableContent,
  ListOfRecordsForPromoter,
  Loading,
  Placeholder,
} from "../../shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RecordServices } from "../../../services";

const RecordListForPromoter = ({ navigation }) => {
  const defaultElectionsInfoState = {
    allStudentsNumber: 0,
    disqualifiedStudentsNumber: 0,
    chosenStudentsNumber: 0,
    electionsEnded: null,
    requestsSent: false,
    tourNumber: 0,
  };
  const defaultDialogsVisibilityState = {
    showInfoDialog: null,
    electionsNotStartedDialog: false,
  };

  const { state } = useContext(AuthContext);
  const [electionsInfo, setElectionsInfo] = useState({
    ...defaultElectionsInfoState,
  });
  const [waitingRecords, setWaitingRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [gettingData, setGettingData] = useState(true);
  const [userActionStatus, setUserActionStatus] = useState(null);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });

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

  const handleUserStartedAction = () => {
    setUserActionStatus(true);
  };

  const handleUserEndedAction = () => {
    setUserActionStatus(false);
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
    RecordServices.getRecordListForPromoter(state.token)
      .then((response) => {
        let waiting_records = [];
        let selected_records = [];
        response.map((item) => {
          if (item.was_selected === null) {
            waiting_records.push(item);
          } else if (item.was_selected === true) {
            selected_records.push(item);
          }
        });
        setWaitingRecords(waiting_records);
        setSelectedRecords(selected_records);
      })
      .catch((error) => {
        //console.log(error);
        setWaitingRecords([]);
        setSelectedRecords([]);
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
    if (gettingData || userActionStatus === false) {
      getData();
      if (userActionStatus === false) {
        setUserActionStatus(null);
      }
    }
  }, [gettingData, userActionStatus]);

  useEffect(() => {
    AsyncStorage.getItem("promoterInformed").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("promoterInformed", "true");
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
      } else {
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
      }
    });
  }, []);

  return gettingData || userActionStatus ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {!selectedRecords.length && !waitingRecords.length ? (
        <Placeholder />
      ) : null}
      <CustomDialog
        visible={dialogsVisibility.showInfoDialog}
        dismissable={false}
        dialogType={`Information`}
        text={`Prośby studentów o dodanie na pracownie dyplomową mogą zostać potwierdzone lub odrzucone za pomocą właściwych przycisków obok każdej z nich:\nZielony przycisk - Potwierdzenie\nCzerwony przycisk - Odrzucenie.\n\nDobrze przemyśl każdą z decyzji, gdyż poszczególnych akcji nie można cofnąć.\n\nPodczas oczekiwania, warto co jakiś czas odświeżyć widok, żeby sprawdzić aktualną ilość próśb.`}
        title={`Jak zarządzać prośbami?`}
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
      <ScrollView>
        <HideableContent
          contentComponent={
            <ListOfRecordsForPromoter
              userStartedAction={handleUserStartedAction}
              userEndedAction={handleUserEndedAction}
              records={waitingRecords}
            />
          }
          headerTitle={`Oczekujące prośby` + ` (${waitingRecords.length})`}
        />
        <HideableContent
          contentComponent={
            <ListOfRecordsForPromoter records={selectedRecords} />
          }
          headerTitle={`Zatwierdzone prośby` + ` (${selectedRecords.length})`}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RecordListForPromoter;
