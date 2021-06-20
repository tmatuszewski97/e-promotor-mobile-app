import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RecordListForPromoter } from "../../components/views/record";
import customStackScreenOptions from "../customStackScreenOptions";

const Stack = createStackNavigator();

const RecordStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={customStackScreenOptions}>
    <Stack.Screen
      name="RecordList"
      component={RecordListForPromoter}
      options={{ title: "Zapisy" }}
    />
  </Stack.Navigator>
);

export default RecordStack;
