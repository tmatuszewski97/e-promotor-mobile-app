import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  FileCreate,
  FileDetail,
  FileList,
  FileUpdate,
} from "../../components/views/file";
import customStackScreenOptions from "../customStackScreenOptions";

const Stack = createStackNavigator();

const FileStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={customStackScreenOptions}>
    <Stack.Screen
      name="FileList"
      component={FileList}
      options={{ title: "Pliki" }}
    />
    <Stack.Screen
      name="FileCreate"
      component={FileCreate}
      options={{ title: "Dodawanie pliku" }}
    />
    <Stack.Screen name="FileDetail" component={FileDetail} />
    <Stack.Screen
      name="FileUpdate"
      component={FileUpdate}
      options={{ title: "Edytowanie pliku" }}
    />
  </Stack.Navigator>
);

export default FileStack;
