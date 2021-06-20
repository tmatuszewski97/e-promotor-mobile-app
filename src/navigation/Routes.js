import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AuthenticationStack from "./authentication/AuthenticationStack";
import { Colors } from "../styles";
import { AuthContext } from "../contexts";
import { DeanWorkerBottomTabNavigator } from "./deanWorker/";
import { PromoterBottomTabNavigator } from "./promoter/";
import { StudentBottomTabNavigator } from "./student";
import { ChooseComponentForUser } from "../components/shared";

const Routes = () => {
  const { state, retrieveToken } = useContext(AuthContext);

  useEffect(() => {
    retrieveToken();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.PRIMARY} barStyle="light-content" />
      {state.token === null ? (
        <AuthenticationStack />
      ) : (
        <ChooseComponentForUser
          deanWorkerComponent={<DeanWorkerBottomTabNavigator />}
          promoterComponent={<PromoterBottomTabNavigator />}
          studentComponent={<StudentBottomTabNavigator />}
        />
      )}
    </NavigationContainer>
  );
};

export default Routes;
