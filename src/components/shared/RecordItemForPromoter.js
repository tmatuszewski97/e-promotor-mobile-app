import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../styles";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { AuthContext } from "../../contexts";
import { updateRecordForPromoter } from "../../services/recordServices";

const RecordItemForPromoter = ({
  item,
  userStartedAction,
  userEndedAction,
  ...props
}) => {
  const { state } = useContext(AuthContext);

  const handleOnPressConfirm = () => {
    userStartedAction();
    updateRecordForPromoter(state.token, item.id, true)
      .then((response) => {
        userEndedAction();
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const handleOnPressReject = () => {
    userStartedAction();
    updateRecordForPromoter(state.token, item.id, false)
      .then((response) => {
        userEndedAction();
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  return (
    <View style={styles.listItemContainer} {...props}>
      {item.was_selected === true ? (
        <MaterialCommunityIcons
          name={`checkbox-marked-circle-outline`}
          color={Colors.GREEN}
          size={42}
        />
      ) : item.was_selected === false ? (
        <MaterialCommunityIcons
          name={`close-circle-outline`}
          color={Colors.RED}
          size={42}
        />
      ) : null}
      <View style={styles.textContainer}>
        <View style={styles.rowSectionContainer}>
          <Text style={styles.listItemText}>
            {`${item.student.user.first_name} ${item.student.user.last_name}\n${item.student.index} ${item.student.specialization}`}
          </Text>
        </View>
        <View style={styles.rowSectionContainer}>
          <Text style={styles.listItemText}>
            {`Tura: ${item.tour_number}\nPreferencja: ${item.preference_number}`}
          </Text>
        </View>
      </View>
      {item.was_selected === null ? (
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={handleOnPressConfirm}>
            <MaterialCommunityIcons
              name={`checkbox-marked-circle`}
              color={Colors.GREEN}
              size={42}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnPressReject}>
            <MaterialCommunityIcons
              name={`close-circle`}
              color={Colors.RED}
              size={42}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: "row",
    marginRight: 5,
  },
  listItemContainer: {
    marginVertical: 10,
    // For Android:
    elevation: 1,
    // For IOS:
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderRadius: 15,
    backgroundColor: Colors.WHITE,
    flexDirection: "row",
    alignItems: "center",
  },
  listItemText: {
    textAlign: "center",
    color: Colors.PRIMARY,
  },
  rowSectionContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
  },
});

export default RecordItemForPromoter;
