import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Header, ListOfPromoters, Loading, Placeholder } from "../../shared";
import { PromoterServices } from "../../../services";

const PromoterListForStudent = ({ navigation, route }) => {
  const { preferenceNumber, recordId } = route.params;
  const { state } = useContext(AuthContext);
  const [promoters, setPromoters] = useState([]);
  const [gettingData, setGettingData] = useState(true);

  const handleOnPressRefresh = () => {
    setGettingData(true);
  };

  const handleOnPressItem = (itemId) => {
    navigation.navigate("PromoterDetail", {
      promoterId: itemId,
      recordId: recordId,
      preferenceNumber: preferenceNumber,
    });
  };

  const headerIconsWithProps = [
    {
      iconName: `refresh`,
      iconLabel: `Odśwież`,
      onPress: handleOnPressRefresh,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Miejsce ${preferenceNumber} - Promotorzy`,
      headerRight: () => <Header iconsWithProps={headerIconsWithProps} />,
    });
  }, [navigation]);

  const getData = () => {
    PromoterServices.getPromoterListForRecord(state.token, recordId)
      .then((response) => {
        setPromoters(response);
      })
      .catch((error) => {
        //console.log(error);
        setPromoters([]);
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
      {promoters && !promoters.length ? <Placeholder /> : null}
      <ListOfPromoters promoters={promoters} onPressItem={handleOnPressItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PromoterListForStudent;
