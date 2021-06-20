import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../contexts";
import {
  CustomDialog,
  DisqualifiedPlaceholder,
  ElectionsInfoDialog,
  GradientButton,
  Header,
  Loading,
  Placeholder,
  RecordItemForStudent,
  TitleWithLines,
} from "../../shared";
import { Colors } from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { RecordServices } from "../../../services";

const RecordListForStudent = ({ navigation }) => {
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
  const [records, setRecords] = useState([]);
  const [gettingData, setGettingData] = useState(true);
  const [studentDisqualified, setStudentDisqualified] = useState(false);
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [waitingForDecisions, setWaitingForDecisions] = useState(null);
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
        setElectionsInfo({ ...defaultElectionsInfoState });
      });
  };

  const handleOnPressHelp = () => {
    setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
  };

  const handleOnPressRefresh = () => {
    setGettingData(true);
  };

  const handleOnPressDeletePromoter = (itemId) => {
    RecordServices.updateRecordForStudent(state.token, itemId)
      .then((response) => {
        setGettingData(true);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const handleOnPressSelectPromoter = (itemId, preferenceNumber) => {
    navigation.navigate("PromoterList", {
      preferenceNumber: preferenceNumber,
      recordId: itemId,
    });
  };

  const handleOnPressSendRequest = () => {
    RecordServices.sendRequestToPromoters(state.token)
      .then((response) => {
        setGettingData(true);
      })
      .catch((error) => {
        //console.log(error);
      });
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
    RecordServices.getRecordListForStudent(state.token)
      .then((response) => {
        setRecords(response);
        if (response.length === 1 && response[0].was_revoked === true) {
          setStudentDisqualified(true);
        } else {
          let selectedPromotersNumber = 0;
          let sendedRequestsNumber = 0;
          let consideredRequestsNumber = 0;
          for (let i = 0; i < response.length; i++) {
            if (response[i].promoter !== null) {
              selectedPromotersNumber++;
              if (response[i].was_sent === true) {
                sendedRequestsNumber++;
                if (response[i].was_selected !== null) {
                  consideredRequestsNumber++;
                }
              } else {
                setWaitingForDecisions(false);
              }
            } else {
              setSubmitButtonEnabled(false);
              break;
            }
          }
          if (selectedPromotersNumber === 3 && sendedRequestsNumber < 3) {
            setSubmitButtonEnabled(true);
          } else if (
            sendedRequestsNumber === 3 &&
            consideredRequestsNumber < 3
          ) {
            setSubmitButtonEnabled(false);
            setWaitingForDecisions(true);
          } else if (consideredRequestsNumber === 3) {
            setSubmitButtonEnabled(false);
            setWaitingForDecisions(false);
          }
        }
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
    AsyncStorage.getItem("studentInformed").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("studentInformed", "true");
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: true });
      } else {
        setDialogsVisibility({ ...dialogsVisibility, showInfoDialog: false });
      }
    });
  }, []);

  return gettingData ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {records && !records.length ? (
        <Placeholder />
      ) : studentDisqualified ? (
        <DisqualifiedPlaceholder />
      ) : null}
      <CustomDialog
        visible={dialogsVisibility.showInfoDialog}
        dismissable={false}
        dialogType={`Information`}
        text={`Na każde z trzech dostępnych miejsc wybierz innego promotora.\nGdy będziesz już pewny swoich wyborów, użyj przycisku "Wyślij prośby". Dobrze przemyśl swoje decyzje, gdyż akcji wysłania próśb nie można cofnąć.\n\nProśby są przekazywane do promotorów w kolejności:\nMiejsce 1 -> Miejsce 2 -> Miejsce 3\n\nPo wysłaniu próśb, warto co jakiś czas odświeżyć widok, żeby sprawdzić ich aktualny stan.`}
        title={`Jak znaleźć promotora?`}
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
      {waitingForDecisions ? (
        <Animatable.View
          style={styles.infoContainer}
          iterationCount={"infinite"}
          direction={`alternate`}
          animation={`fadeIn`}
        >
          <Text
            style={styles.infoText}
          >{`Oczekiwanie na decyzję promotorów...`}</Text>
        </Animatable.View>
      ) : null}
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          {records !== null ? (
            <TitleWithLines title={`Tura ` + records[0].tour_number} />
          ) : null}
          <View style={styles.bodyContainer}>
            {records.map((item) => (
              <RecordItemForStudent
                key={item.id}
                item={item}
                onPressDeletePromoter={handleOnPressDeletePromoter}
                onPressSelectPromoter={handleOnPressSelectPromoter}
              />
            ))}
            {submitButtonEnabled ? (
              <GradientButton
                onPress={handleOnPressSendRequest}
                text={`Wyślij prośby`}
                fontSize={12}
                style={{ width: 150, alignSelf: "center" }}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 4,
  },
  container: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    zIndex: 1,
    padding: 4,
  },
  infoText: {
    color: Colors.WHITE,
  },
  scrollViewContainer: {
    paddingVertical: 4,
  },
});

export default RecordListForStudent;
