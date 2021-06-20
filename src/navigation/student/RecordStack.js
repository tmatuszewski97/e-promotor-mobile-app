import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RecordListForStudent } from "../../components/views/record";
import customStackScreenOptions from "../customStackScreenOptions";
import {
  PromoterListForStudent,
  PromoterDetailForStudent,
} from "../../components/views/promoter";

const Stack = createStackNavigator();

const RecordStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={customStackScreenOptions}>
    <Stack.Screen
      name="RecordList"
      component={RecordListForStudent}
      options={{ title: "Zapisy" }}
    />
    <Stack.Screen name="PromoterList" component={PromoterListForStudent} />
    <Stack.Screen name="PromoterDetail" component={PromoterDetailForStudent} />
  </Stack.Navigator>
);

export default RecordStack;
