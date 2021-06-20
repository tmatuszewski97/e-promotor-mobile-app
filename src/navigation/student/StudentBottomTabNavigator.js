import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import RecordStack from "./RecordStack";
import UserStack from "./UserStack";
import { Colors } from "../../styles";

const Tab = createBottomTabNavigator();

const StudentBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="RecordStack"
      tabBarOptions={{
        activeTintColor: Colors.WHITE,
        style: {
          backgroundColor: Colors.PRIMARY,
          paddingBottom: 5,
          paddingTop: 5,
        },
        labelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="RecordStack"
        component={RecordStack}
        options={{
          tabBarLabel: "Zapisy",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="draw" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="UserStack"
        component={UserStack}
        options={{
          tabBarLabel: "Konto",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentBottomTabNavigator;
