import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import Routes from "./Routes";
import { AuthProvider } from "../contexts";

const Providers = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default Providers;
