import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { Colors } from "../../../styles";
import { GradientButton } from "../../shared";

function WelcomeView({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <Animatable.View
        style={styles.logoTitleContainer}
        animation="bounceInDown"
        duration={1500}
      >
        <Image
          style={styles.logo}
          source={require("../../../assets/images/app_icon.png")}
          resizeMode="stretch"
        />
        <Text style={styles.appTitle}>{`Aplikacja ePromotor`}</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUpBig" style={styles.bodyContainer}>
        <Text style={styles.bodyTitle}>{`Witaj użytkowniku !`}</Text>
        <Text
          style={styles.bodyText}
        >{`Aplikacja ma na celu wsparcie procesu wyboru promotorów na Uniwersytecie Warmińsko Mazurskim w Olsztynie na wydziale Matematyki i Informatyki.`}</Text>
        <View style={styles.buttonContainer}>
          <GradientButton
            fontSize={16}
            onPress={() => navigation.navigate("SignInView")}
            text={`Logowanie`}
          />
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
}

const height_dim = Dimensions.get("screen").height;
const height_logo = height_dim * 0.3;

const styles = StyleSheet.create({
  appTitle: {
    fontWeight: "bold",
    fontSize: 28,
    color: Colors.WHITE,
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: Colors.SECONDARY,
    paddingHorizontal: 30,
  },
  bodyText: {
    fontWeight: "bold",
    fontSize: 14,
    color: Colors.PRIMARY,
  },
  bodyTitle: {
    fontWeight: "bold",
    fontSize: 24,
    color: Colors.PRIMARY,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 25,
    alignSelf: "flex-end",
    right: 30,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  logoTitleContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WelcomeView;
