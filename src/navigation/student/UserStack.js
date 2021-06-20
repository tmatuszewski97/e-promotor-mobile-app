import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { UserChangePassword, UserDetail } from "../../components/views/user";
import customStackScreenOptions from "../customStackScreenOptions";

const Stack = createStackNavigator();

const UserStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={customStackScreenOptions}>
    <Stack.Screen
      name="UserDetail"
      component={UserDetail}
      options={{ title: "Konto" }}
    />
    <Stack.Screen
      name="UserChangePassword"
      component={UserChangePassword}
      options={{ title: "Zmiana hasła" }}
    />
  </Stack.Navigator>
);

export default UserStack;
