import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";
import GradientButton from "./GradientButton";
import { Colors } from "../../styles/";

const CustomDialog = ({
  dialogType,
  text,
  title,
  onPressCancel,
  onPressConfirm,
  ...props
}) => {
  return (
    <Portal>
      <Dialog style={styles.dialog} {...props}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            {dialogType === `Error` ? (
              <Ionicons name="sad-outline" size={40} color={Colors.RED} />
            ) : dialogType === `Confirmation` ? (
              <Ionicons name="alert" size={40} color={Colors.RED} />
            ) : dialogType === `Information` ? (
              <Ionicons name="alert" size={40} color={Colors.RED} />
            ) : dialogType === `InformationPositive` ? (
              <Ionicons name="happy-outline" size={40} color={Colors.GREEN} />
            ) : dialogType === "Waiting" ? (
              <Ionicons name="download" size={40} color={Colors.PRIMARY} />
            ) : null}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.dialogTitle}>{title}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.dialogText}>{text}</Text>
        </View>
        <Dialog.Actions style={{ paddingHorizontal: 0 }}>
          {dialogType === "Waiting" ? null : (
            <>
              <GradientButton
                text={`Potwierdź`}
                fontColor={Colors.WHITE}
                fontSize={16}
                onPress={onPressConfirm}
                linearGradientFirstColor={Colors.LIGHTER_PRIMARY}
                backgroundColor={Colors.PRIMARY}
                linearGradientSecondColor={Colors.LIGHTER_PRIMARY}
              />
              {dialogType === `Confirmation` ? (
                <GradientButton
                  text={`Anuluj`}
                  fontColor={Colors.WHITE}
                  fontSize={16}
                  onPress={onPressCancel}
                  linearGradientFirstColor={Colors.LIGHTER_PRIMARY}
                  backgroundColor={Colors.PRIMARY}
                  linearGradientSecondColor={Colors.LIGHTER_PRIMARY}
                  style={{ marginLeft: 10 }}
                />
              ) : null}
            </>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderWidth: 2,
    borderRadius: 25,
    padding: 10,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
  },
  dialogText: {
    color: Colors.PRIMARY,
  },
  dialogTitle: {
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.PRIMARY,
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderColor: Colors.PRIMARY,
    paddingVertical: 5,
    marginBottom: 5,
  },
  iconContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
  titleContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomDialog;
