import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { CustomDialog, DeanWorkerProfile, Loading } from "../../shared";
import { DeanWorkerServices } from "../../../services";

const DeanWorkerDetail = ({ route, navigation }) => {
  const { deanWorkerId } = route.params;
  const { state } = useContext(AuthContext);
  const [deanWorker, setDeanWorker] = useState(null);
  const [gettingData, setGettingData] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleContainerStyle: {
        width: "50%",
      },
      title: deanWorker
        ? `${deanWorker.user.first_name} ${deanWorker.user.last_name}`
        : null,
    });
  }, [navigation, gettingData]);

  const getData = () => {
    DeanWorkerServices.getDeanWorkerDetail(state.token, deanWorkerId)
      .then((response) => {
        setDeanWorker(response);
      })
      .catch((error) => {
        //console.log(error);
        setDeanWorker(null);
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

  return gettingData ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {!deanWorker ? (
        <CustomDialog
          visible={!deanWorker}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie można pobrać szczegółowych informacji o pracowniku. Być może został on usunięty. Zostaniesz przeniesiony do listy pracowników dziekanatu.`}
          title={`Błąd pobierania danych`}
          onPressConfirm={() => {
            navigation.navigate("DeanWorkerList");
          }}
        />
      ) : (
        <ScrollView>
          <DeanWorkerProfile deanWorkerData={deanWorker} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DeanWorkerDetail;
