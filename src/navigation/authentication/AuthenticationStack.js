import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WelcomeView, SignInView } from "../../components/views/authentication";

const AuthStack = createStackNavigator();

const AuthenticationStack = ({ navigation }) => {
  return (
    <AuthStack.Navigator
      headerMode="none"
      screenOptions={{ animationEnabled: false }}
    >
      <AuthStack.Screen name="WelcomeView" component={WelcomeView} />
      <AuthStack.Screen name="SignInView" component={SignInView} />
    </AuthStack.Navigator>
  );
};

export default AuthenticationStack;
