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
import { CustomDialog, Header, Loading, StudentProfile } from "../../shared";
import { StudentServices } from "../../../services";

const StudentDetail = ({ route, navigation }) => {
  const defaultDialogsVisibilityState = {
    confirmDeletion: false,
    studentDeleted: null,
  };

  const { studentId } = route.params;
  const { state } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingData, setGettingData] = useState(true);
  const [dialogsVisibility, setDialogsVisibility] = useState({
    ...defaultDialogsVisibilityState,
  });

  const handleOnPressEdit = () => {
    navigation.navigate("StudentUpdate", {
      studentId: studentId,
    });
  };

  const handleOnPressDelete = () => {
    setDialogsVisibility({ ...dialogsVisibility, confirmDeletion: true });
  };

  const handleDeleteStudent = () => {
    setLoading(true);
    StudentServices.deleteStudent(state.token, student.id)
      .then((response) => {
        setDialogsVisibility({
          ...dialogsVisibility,
          confirmDeletion: false,
          studentDeleted: true,
        });
      })
      .catch((error) => {
        //console.log(error);
        setDialogsVisibility({ ...dialogsVisibility, studentDeleted: false });
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
        width: "50%",
      },
      title: student
        ? `${student.user.first_name} ${student.user.last_name}`
        : null,
      headerRight: () => {
        return <Header iconsWithProps={headerIconsWithProps} />;
      },
    });
  }, [navigation, gettingData]);

  const getData = () => {
    StudentServices.getStudentDetail(state.token, studentId)
      .then((response) => {
        setStudent(response);
      })
      .catch((error) => {
        //console.log(error);
        setStudent(null);
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
        text={`Po zatwierdzeniu, student zostanie nieodwracalnie usunięty.\nCzy chcesz kontynuować?`}
        title={`Ważna informacja`}
        onPressCancel={() => {
          setDialogsVisibility({
            ...dialogsVisibility,
            confirmDeletion: false,
          });
        }}
        onPressConfirm={handleDeleteStudent}
      />
      <CustomDialog
        visible={dialogsVisibility.studentDeleted}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={`Student został pomyślnie usunięty. Zostaniesz przeniesiony do listy studentów.`}
        title={`Usuwanie zakończone powodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("StudentList");
        }}
      />
      <CustomDialog
        visible={dialogsVisibility.studentDeleted === false}
        dismissable={false}
        dialogType={`Error`}
        text={`Student nie został usunięty. Zostaniesz przeniesiony do listy studentów.`}
        title={`Usuwanie zakończone niepowodzeniem`}
        onPressConfirm={() => {
          navigation.navigate("StudentList");
        }}
      />
      {!student ? (
        <CustomDialog
          visible={!student}
          dismissable={false}
          dialogType={`Error`}
          text={`Nie można pobrać szczegółowych informacji o studencie. Być może został on usunięty. Zostaniesz przeniesiony do listy studentów.`}
          title={`Błąd pobierania danych`}
          onPressConfirm={() => {
            navigation.navigate("StudentList");
          }}
        />
      ) : (
        <ScrollView>
          <StudentProfile studentData={student} />
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

export default StudentDetail;
