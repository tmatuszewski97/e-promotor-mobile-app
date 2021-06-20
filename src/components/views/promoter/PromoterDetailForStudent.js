import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../../../styles";
import {
  CustomCard,
  CustomDialog,
  FileItem,
  GradientButton,
  Loading,
  PromoterProfile,
} from "../../shared";
import { PromoterServices, RecordServices } from "../../../services";

const PromoterDetailForStudent = ({ route, navigation }) => {
  const { preferenceNumber, promoterId, recordId } = route.params;
  const { state } = useContext(AuthContext);
  const [promoter, setPromoter] = useState(null);
  const [gettingData, setGettingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [promoterSelectedDialog, setPromoterSelectedDialog] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: !gettingData
        ? `Miejsce ${preferenceNumber} - ${promoter.title} ${promoter.user.first_name} ${promoter.user.last_name}`
        : null,
    });
  }, [navigation, gettingData]);

  const getData = () => {
    PromoterServices.getPromoterDetailForRecord(
      state.token,
      promoterId,
      recordId
    )
      .then((response) => {
        setPromoter(response);
      })
      .catch((error) => {
        //console.log(error);
        setPromoter(null);
      })
      .finally(() => {
        setGettingData(false);
      });
  };

  const handleOnPressChoosePromoter = () => {
    setLoading(true);
    RecordServices.selectPromoterForRecord(state.token, promoterId, recordId)
      .then((response) => {
        // console.log(response);
        setLoading(false);
        setPromoterSelectedDialog(true);
        navigation.navigate("RecordList");
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        setPromoterSelectedDialog(false);
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
      {!promoter ? (
        <CustomDialog
          visible={!promoter}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie można pobrać szczegółowych informacji o promotorze. Być może został on usunięty. Zostaniesz przeniesiony do listy promotorów.`}
          title={`Błąd pobierania danych`}
          onPressConfirm={() => {
            navigation.navigate("PromoterList");
          }}
        />
      ) : (
        <>
          <CustomDialog
            visible={promoterSelectedDialog === false}
            dismissable={false}
            dialogType={`Error`}
            text={`Nie można wybrać promotora na wskazane miejsce. Zostaniesz przeniesiony do listy promotorów.`}
            title={`Błąd przesyłu danych`}
            onPressConfirm={() => {
              navigation.navigate("PromoterList");
            }}
          />
          <ScrollView>
            <View style={styles.scrollViewContainer}>
              <PromoterProfile promoterData={promoter} />
              {promoter.user.files.length > 0 ? (
                <CustomCard
                  style={{ flex: 1, borderColor: Colors.PRIMARY }}
                  iconName={`folder-outline`}
                  iconColor={Colors.PRIMARY}
                  titleText={`Pliki promotora`}
                  titleColor={Colors.PRIMARY}
                  bodyComponent={promoter.user.files.map((item) => {
                    return (
                      <FileItem
                        key={item.id}
                        item={item}
                        activeOpacity={1}
                        enabled={false}
                      />
                    );
                  })}
                />
              ) : null}
              <GradientButton
                fontSize={12}
                onPress={handleOnPressChoosePromoter}
                text={`Wybierz promotora`}
                style={{ marginTop: 8, alignSelf: "center" }}
              />
            </View>
          </ScrollView>
        </>
      )}
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

export default PromoterDetailForStudent;
