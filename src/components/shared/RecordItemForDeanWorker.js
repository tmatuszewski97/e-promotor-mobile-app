import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles";

const RecordItemForDeanWorker = ({ item, ...props }) => {
  return (
    <View style={styles.container} {...props}>
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{`Student`}</Text>
        <View style={styles.centeredColumnSection}>
          <Text style={styles.text}>
            {`${item.student.user.first_name} ${item.student.user.last_name}\n${item.student.index} ${item.student.specialization}`}
          </Text>
        </View>
      </View>
      {!item.was_revoked ? (
        <>
          <View style={styles.column}>
            <View style={styles.centeredColumnSection}>
              <Text style={styles.textPositive}>{`przypisany do`}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>{`Promotor`}</Text>
            <View style={styles.centeredColumnSection}>
              <Image
                style={styles.image}
                source={
                  item.promoter.image != null
                    ? { uri: item.promoter.image }
                    : require("../../assets/images/blank_profile_picture.png")
                }
              />
              <Text style={styles.text}>
                {`${item.promoter.user.first_name} ${item.promoter.user.last_name}`}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.widerColumn}>
          <Text
            style={styles.textNegative}
          >{`zdyskwalifikowany za bezczynność`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredColumnSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  columnTitle: {
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  container: {
    marginBottom: 4,
    padding: 4,
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
    backgroundColor: Colors.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 50,
    marginHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  textNegative: {
    textAlign: "center",
    color: Colors.RED,
    fontWeight: "bold",
  },
  textPositive: {
    textAlign: "center",
    color: Colors.GREEN,
    fontWeight: "bold",
  },
  widerColumn: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RecordItemForDeanWorker;
