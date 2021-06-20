import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { AuthContext } from "../../../contexts";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../../../styles";
import {
  ChooseComponentForUser,
  CustomCard,
  CustomDialog,
  FileItem,
  Header,
  Loading,
  PromoterProfile,
} from "../../shared";
import { PromoterServices } from "../../../services";

const PromoterDetail = ({ route, navigation }) => {
  const defaultDialogsVisibilityState = {
    confirmDeletion: false,
    promoterDeleted: null,
  };

  const { promoterId } = route.params;
  const { state } = useContext(AuthContext);
  const [promoter, setPromoter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });

  const handleOnPressEdit = () => {
    navigation.navigate("PromoterUpdate", {
      promoterId: promoterId,
    });
  };

  const handleOnPressDelete = () => {
    setDialogsVisibility({ ...dialogsVisibility, confirmDeletion: true });
  };

  const handleDeletePromoter = () => {
    setLoading(true);
    PromoterServices.deletePromoter(state.token, promoter.id)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          confirmDeletion: false,
          promoterDeleted: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({ ...dialogsVisibility, promoterDeleted: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const headerIconsWithProps = [
    {
      iconName: `account-edit`,
      iconLabel: `Edytuj`,
      onPress: handleOnPressEdit,
    },
    {
      iconName: `account-remove`,
      iconLabel: `Usuń`,
      onPress: handleOnPressDelete,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleContainerStyle: {
        width: state.user.role == 2 ? "50%" : "100%",
      },
      title: promoter
        ? promoter.title +
          ` ` +
          promoter.user.first_name +
          ` ` +
          promoter.user.last_name
        : null,
      headerRight: () => {
        return (
          <ChooseComponentForUser
            deanWorkerComponent={
              <Header iconsWithProps={headerIconsWithProps} />
            }
            promoterComponent={null}
            studentComponent={null}
          />
        );
      },
    });
  }, [navigation, gettingData]);

  const getData = () => {
    PromoterServices.getPromoterDetail(state.token, promoterId)
      .then((response) => {
        setPromoter(response);
      })
      .catch((error) => {
        setPromoter(null);
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
      <CustomDialog
        visible={dialogsVisibility.confirmDeletion}
        dismissable={false}
        dialogType={`Confirmation`}
        text={`Po zatwierdzeniu, promotor zostanie nieodwracalnie usunięty.\nCzy chcesz kontynuować?`}
        title={`Ważna informacja`}
        onPressCancel={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            confirmDeletion: false,
          });
        }}
        onPressConfirm={handleDeletePromoter}
      />
      <CustomDialog
        visible={dialogsVisibility.promoterDeleted}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Promotor został pomyślnie usunięty. Zostaniesz przeniesiony do listy promotorów.`}
        title={`Usuwanie zakończone powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("PromoterList");
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.promoterDeleted === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Promotor nie został usunięty. Zostaniesz przeniesiony do listy promotorów.`}
        title={`Usuwanie zakończone niepowodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("PromoterList");
        }}
      />
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
        <ScrollView>
          <View style={styles.scrollViewContainer}>
            <PromoterProfile promoterData={promoter} />
            {promoter.user.files.length > 0 ? (
              <CustomCard
                style={{ flex: 1, borderColor: Colors.PRIMARY, margin: 4 }}
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
            <ChooseComponentForUser
              administratorComponent={
                promoter.contact ? (
                  <CustomCard
                    style={{ borderColor: Colors.PRIMARY }}
                    iconName={`chat-outline`}
                    iconColor={Colors.PRIMARY}
                    titleText={`Kontakt`}
                    titleColor={Colors.PRIMARY}
                    bodyComponent={
                      <Text style={styles.cardText}>{promoter.contact}</Text>
                    }
                  />
                ) : null
              }
              deanWorkerComponent={
                promoter.max_students_number ? (
                  <CustomCard
                    style={{ borderColor: Colors.PRIMARY }}
                    iconName={`account-group-outline`}
                    iconColor={Colors.PRIMARY}
                    titleText={`Maksymalna liczba studentów`}
                    titleColor={Colors.PRIMARY}
                    bodyComponent={
                      <Text style={styles.cardText}>
                        {promoter.max_students_number}
                      </Text>
                    }
                  />
                ) : null
              }
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardText: {
    color: Colors.PRIMARY,
  },
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 4,
  },
});

export default PromoterDetail;
