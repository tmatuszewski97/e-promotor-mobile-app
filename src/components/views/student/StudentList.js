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
import { StudentServices } from "../../../services";
import { useSelectionChange } from "../../../hooks";

const StudentList = ({ navigation }) => {
  const defaultDialogsVisibilityState = {
    confirmDeletion: false,
    accountsDeleted: null,
  };

  const { state } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const selectionMode = useSelectionChange(students);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });

  const setSelectedStudents = (userId) => {
    const newData = students.map((studentItem) => {
      if (studentItem.id === userId) {
        return {
          ...studentItem,
          selected: !studentItem.selected,
        };
      }
      return {
        ...studentItem,
        selected: studentItem.selected,
      };
    });
    setStudents(newData);
  };

  const handleOnPressItem = (itemId) => {
    if (selectionMode) {
      setSelectedStudents(itemId);
    } else {
      navigation.navigate("StudentDetail", {
        studentId: itemId,
      });
    }
  };

  const handleOnLongPressItem = (itemId) => {
    setSelectedStudents(itemId);
  };

  const handleOnPressRegister = () => {
    navigation.navigate("ChooseStudentRegistration");
  };

  const handleOnPressRefresh = () => {
    setGettingData(true);
  };

  const handleOnPressDeleteAccounts = () => {
    setDialogsVisibility({ ...dialogsVisibility, confirmDeletion: true });
  };

  const handleDeleteAccounts = () => {
    setLoading(true);
    const selectedStudentIds = [];
    students.map((student) => {
      if (student.selected == true) {
        selectedStudentIds.push(student.id);
      }
    });
    StudentServices.bulkDeleteStudent(state.token, selectedStudentIds)
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
    const newData = students.map((studentItem) => {
      return {
        ...studentItem,
        selected: true,
      };
    });
    setStudents(newData);
  };

  const handleOnPressCancel = () => {
    const newData = students.map((studentItem) => {
      return {
        ...studentItem,
        selected: false,
      };
    });
    setStudents(newData);
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
            students.filter((student) => student.selected === true).length
          })`
        : `Studenci`,
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
  }, [navigation, selectionMode, students]);

  const getData = () => {
    StudentServices.getStudentList(state.token)
      .then((response) => {
        setStudents(response);
      })
      .catch((error) => {
        //console.log(error);
        setStudents([]);
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
      {students && !students.length ? <Placeholder /> : null}
      <CustomDialog
        visible={dialogsVisibility.confirmDeletion}
        dismissable={false}
        dialogType={`Confirmation`}
        text={`Po zatwierdzeniu, wybrane konta oraz powiązane z nimi rekordy (dane zapisów użytkownika) zostaną nieodwracalnie usunięte.\nCzy chcesz kontynuować?`}
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
        text={`Konta studentów oraz powiązane z nimi rekordy, zostały pomyślnie usunięte.`}
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
        text={`Konta studentów nie mogły zostać usunięte.`}
        title={`Usuwanie zakończone niepowodzeniem`}
        onPressConfirm={() => {
          setDialogsVisibility({ ...dialogsVisibility, accountsDeleted: null });
          setGettingData(true);
        }}
      />
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserBasicInfoItem
            iconName={`school`}
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

export default StudentList;
