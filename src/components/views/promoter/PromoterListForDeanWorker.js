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
import {
  CustomDialog,
  Header,
  Loading,
  Placeholder,
  UserBasicInfoItem,
} from "../../shared";
import { PromoterServices } from "../../../services";
import { useSelectionChange } from "../../../hooks";

const PromoterListForDeanWorker = ({ navigation }) => {
  const defaultDialogsVisibilityState = {
    confirmDeletion: false,
    accountsDeleted: null,
  };

  const { state } = useContext(AuthContext);
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const selectionMode = useSelectionChange(promoters);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });

  const setSelectedPromoters = (userId) => {
    const newData = promoters.map((promoterItem) => {
      if (promoterItem.id === userId) {
        return {
          ...promoterItem,
          selected: !promoterItem.selected,
        };
      }
      return {
        ...promoterItem,
        selected: promoterItem.selected,
      };
    });
    setPromoters(newData);
  };

  const handleOnPressItem = (itemId) => {
    if (selectionMode) {
      setSelectedPromoters(itemId);
    } else {
      navigation.navigate("PromoterDetail", {
        promoterId: itemId,
      });
    }
  };

  const handleOnLongPressItem = (itemId) => {
    setSelectedPromoters(itemId);
  };

  const handleOnPressRegister = () => {
    navigation.navigate("ChoosePromoterRegistration");
  };

  const handleOnPressRefresh = () => {
    setGettingData(true);
  };

  const handleOnPressDeleteAccounts = () => {
    setDialogsVisibility({ ...dialogsVisibility, confirmDeletion: true });
  };

  const handleDeleteAccounts = () => {
    setLoading(true);
    const selectedPromoterIds = [];
    promoters.map((promoter) => {
      if (promoter.selected == true) {
        selectedPromoterIds.push(promoter.id);
      }
    });
    PromoterServices.bulkDeletePromoter(state.token, selectedPromoterIds)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          confirmDeletion: false,
          accountsDeleted: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({ ...dialogsVisibility, accountsDeleted: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnPressSelectAll = () => {
    const newData = promoters.map((promoterItem) => {
      return {
        ...promoterItem,
        selected: true,
      };
    });
    setPromoters(newData);
  };

  const handleOnPressCancel = () => {
    const newData = promoters.map((promoterItem) => {
      return {
        ...promoterItem,
        selected: false,
      };
    });
    setPromoters(newData);
  };

  const normalHeaderIconsWithProps = [
    {
      iconName: `account-plus`,
      iconLabel: `Dodaj użytkowników`,
      onPress: handleOnPressRegister,
    },
    {
      iconName: `refresh`,
      iconLabel: `Odśwież`,
      onPress: handleOnPressRefresh,
    },
  ];

  const selectionModeHeaderIconsWithProps = [
    {
      iconName: `account-remove`,
      iconLabel: `Usuń`,
      onPress: handleOnPressDeleteAccounts,
    },
    {
      iconName: `account-multiple-check`,
      iconLabel: `Wszyscy`,
      onPress: handleOnPressSelectAll,
    },
    {
      iconName: `chevron-left`,
      iconLabel: `Anuluj`,
      onPress: handleOnPressCancel,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: selectionMode
        ? `Zaznaczano (${
            promoters.filter((promoter) => promoter.selected === true).length
          })`
        : `Promotorzy`,
      headerRight: () => (
        <Header
          iconsWithProps={
            selectionMode
              ? selectionModeHeaderIconsWithProps
              : normalHeaderIconsWithProps
          }
        />
      ),
    });
  }, [navigation, selectionMode, promoters]);

  const getData = () => {
    PromoterServices.getPromoterList(state.token)
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

  return gettingData || loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {promoters && !promoters.length ? <Placeholder /> : null}
      <CustomDialog
        visible={dialogsVisibility.confirmDeletion}
        dismissable={false}
        dialogType={`Confirmation`}
        text={`Po zatwierdzeniu, wybrane konta zostaną nieodwracalnie usunięte.\nCzy chcesz kontynuować?`}
        title={`Ważna informacja`}
        onPressCancel={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            confirmDeletion: false,
          });
        }}
        onPressConfirm={handleDeleteAccounts}
      />
      <CustomDialog
        visible={dialogsVisibility.accountsDeleted}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Konta promotorów zostały pomyślnie usunięte.`}
        title={`Usuwanie zakończone powodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, accountsDeleted: null });
          setGettingData(true);
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.accountsDeleted === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Konta promotorów nie mogły zostać usunięte.`}
        title={`Usuwanie zakończone niepowodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, accountsDeleted: null });
          setGettingData(true);
        }}
      />
      <FlatList
        data={promoters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserBasicInfoItem
            iconName={`account-tie`}
            selected={item.selected}
            userData={item}
            onPress={() => handleOnPressItem(item.id)}
            onLongPress={() => handleOnLongPressItem(item.id)}
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

export default PromoterListForDeanWorker;
