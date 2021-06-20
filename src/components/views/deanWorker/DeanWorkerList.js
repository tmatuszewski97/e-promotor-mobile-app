import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Header, Loading, Placeholder, UserBasicInfoItem } from "../../shared";
import { DeanWorkerServices } from "../../../services";

const DeanWorkerList = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const [deanWorkers, setDeanWorkers] = useState([]);
  const [gettingData, setGettingData] = useState(true);

  const handleOnPressItem = (itemId) => {
    navigation.navigate("DeanWorkerDetail", {
      deanWorkerId: itemId,
    });
  };

  const handleOnPressRefresh = () => {
    setGettingData(true);
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
      headerRight: () => <Header iconsWithProps={headerIconsWithProps} />,
    });
  }, [navigation]);

  const getData = () => {
    DeanWorkerServices.getDeanWorkerList(state.token)
      .then((response) => {
        setDeanWorkers(response);
        setGettingData(false);
      })
      .catch((error) => {
        //console.log(error);
        setDeanWorkers([]);
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
      {deanWorkers && !deanWorkers.length ? <Placeholder /> : null}
      <FlatList
        data={deanWorkers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserBasicInfoItem
            iconName={`school`}
            userData={item}
            onPress={() => handleOnPressItem(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DeanWorkerList;
