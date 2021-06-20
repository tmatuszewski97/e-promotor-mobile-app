import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { PromoterList, PromoterDetail } from "../../components/views/promoter";
import customStackScreenOptions from "../customStackScreenOptions";

const Stack = createStackNavigator();

const PromoterStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={customStackScreenOptions}>
    <Stack.Screen
      name="PromoterList"
      component={PromoterList}
      options={{ title: "Promotorzy" }}
    />
    <Stack.Screen name="PromoterDetail" component={PromoterDetail} />
  </Stack.Navigator>
);

export default PromoterStack;
