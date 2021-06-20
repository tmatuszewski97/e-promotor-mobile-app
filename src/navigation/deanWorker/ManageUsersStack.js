import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  DeanWorkerDetail,
  DeanWorkerList,
} from "../../components/views/deanWorker";
import {
  ChoosePromoterRegistration,
  PromoterBulkRegister,
  PromoterDetail,
  PromoterListForDeanWorker,
  PromoterRegister,
  PromoterUpdate,
} from "../../components/views/promoter";
import {
  ChooseStudentRegistration,
  StudentBulkRegister,
  StudentDetail,
  StudentList,
  StudentRegister,
  StudentUpdate,
} from "../../components/views/student";
import { ChooseUsersGroup } from "../../components/views/user";
import customStackScreenOptions from "../customStackScreenOptions";

const Stack = createStackNavigator();

const ManageUsersStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={customStackScreenOptions}>
    <Stack.Screen
      name="ChooseUserGroup"
      component={ChooseUsersGroup}
      options={{ title: "Grupy użytkowników" }}
    />
    <Stack.Screen
      name="DeanWorkerList"
      component={DeanWorkerList}
      options={{ title: "Dziekanat" }}
    />
    <Stack.Screen name="DeanWorkerDetail" component={DeanWorkerDetail} />
    <Stack.Screen
      name="PromoterList"
      component={PromoterListForDeanWorker}
      options={{ title: "Promotorzy" }}
    />
    <Stack.Screen
      name="ChoosePromoterRegistration"
      component={ChoosePromoterRegistration}
      options={{ title: "Typy rejestracji" }}
    />
    <Stack.Screen
      name="PromoterRegister"
      component={PromoterRegister}
      options={{ title: "Dodawanie promotora" }}
    />
    <Stack.Screen
      name="PromoterBulkRegister"
      component={PromoterBulkRegister}
      options={{ title: "Dodawanie promotorów" }}
    />
    <Stack.Screen name="PromoterDetail" component={PromoterDetail} />
    <Stack.Screen
      name="PromoterUpdate"
      component={PromoterUpdate}
      options={{ title: "Edytowanie promotora" }}
    />
    <Stack.Screen name="StudentList" component={StudentList} />
    <Stack.Screen
      name="ChooseStudentRegistration"
      component={ChooseStudentRegistration}
      options={{ title: "Typy rejestracji" }}
    />
    <Stack.Screen
      name="StudentRegister"
      component={StudentRegister}
      options={{ title: "Dodawanie studenta" }}
    />
    <Stack.Screen
      name="StudentBulkRegister"
      component={StudentBulkRegister}
      options={{ title: "Dodawanie studentów" }}
    />
    <Stack.Screen name="StudentDetail" component={StudentDetail} />
    <Stack.Screen
      name="StudentUpdate"
      component={StudentUpdate}
      options={{ title: "Edytowanie studenta" }}
    />
  </Stack.Navigator>
);

export default ManageUsersStack;
