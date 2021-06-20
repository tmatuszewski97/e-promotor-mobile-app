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
import { Header, HideableContent, ListOfFiles, Loading } from "../../shared";
import { FileServices } from "../../../services";

const FileList = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const [myFiles, setMyFiles] = useState([]);
  const [sharedForMeFiles, setSharedForMeFiles] = useState([]);
  const [gettingData, setGettingData] = useState(true);

  const handleOnPressItem = (itemId) => {
    navigation.navigate("FileDetail", {
      fileId: itemId,
    });
  };

  const handleOnPressCreate = () => {
    navigation.navigate("FileCreate");
  };

  const handleOnPressRefresh = () => {
    setGettingData(true);
  };

  const headerIconsWithProps = [
    {
      iconName: `file-export`,
      iconLabel: `Dodaj plik`,
      onPress: handleOnPressCreate,
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
    FileServices.getFileList(state.token)
      .then((response) => {
        let userFiles = [];
        let sharedForUserFiles = [];
        response.map((item) => {
          if (item.creator.email === state.user.email) {
            userFiles.push(item);
          } else if (item.creator.email !== state.user.email) {
            sharedForUserFiles.push(item);
          }
        });
        setMyFiles(userFiles);
        setSharedForMeFiles(sharedForUserFiles);
      })
      .catch((error) => {
        //console.log(error);
        setMyFiles([]);
        setSharedForMeFiles([]);
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
      <ScrollView>
        <HideableContent
          contentComponent={
            <ListOfFiles onPressItem={handleOnPressItem} files={myFiles} />
          }
          headerTitle={`Twoje pliki` + ` (${myFiles.length})`}
        />
        <HideableContent
          contentComponent={
            <ListOfFiles
              onPressItem={handleOnPressItem}
              files={sharedForMeFiles}
            />
          }
          headerTitle={
            `Udostępnione dla Ciebie` + ` (${sharedForMeFiles.length})`
          }
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

export default FileList;
