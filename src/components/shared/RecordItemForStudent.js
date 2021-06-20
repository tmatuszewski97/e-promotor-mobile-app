import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../styles";

const RecordItemForStudent = ({
  item,
  onPressDeletePromoter,
  onPressSelectPromoter,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {`Miejsce ` + item.preference_number}
        </Text>
      </View>
      {item.promoter === null ? (
        <TouchableOpacity
          style={styles.touchableTextContainer}
          onPress={() => onPressSelectPromoter(item.id, item.preference_number)}
        >
          <Text
            style={(styles.touchableText, { color: Colors.PRIMARY })}
          >{`Wybierz promotora...`}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.recordDataContainer}>
            {item.was_selected !== null ? (
              <View style={styles.textContainer}>
                {item.was_selected === true ? (
                  <Text
                    style={[styles.text, { color: Colors.GREEN }]}
                  >{`Prośba potwierdzona`}</Text>
                ) : (
                  <Text
                    style={[styles.text, { color: Colors.RED }]}
                  >{`Prośba odrzucona`}</Text>
                )}
              </View>
            ) : null}
            <View style={styles.promoterDataContainer}>
              <View style={styles.imageContainer}>
                <Image
                  style={[
                    styles.image,
                    item.was_selected === null
                      ? { alignSelf: "flex-end" }
                      : null,
                  ]}
                  source={
                    item.promoter.image != null
                      ? { uri: item.promoter.image }
                      : require("../../assets/images/blank_profile_picture.png")
                  }
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.text, { color: Colors.PRIMARY }]}>
                  {item.promoter.title +
                    " " +
                    item.promoter.user.first_name +
                    " " +
                    item.promoter.user.last_name}
                </Text>
              </View>
            </View>
          </View>
          {item.was_sent === false ? (
            <TouchableOpacity
              style={styles.touchableTextContainer}
              onPress={() => onPressDeletePromoter(item.id)}
            >
              <Text
                style={(styles.touchableText, { color: Colors.RED })}
              >{`Usuń promotora`}</Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: Colors.PRIMARY,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 20,
    textAlign: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 50,
    marginHorizontal: 10,
  },
  imageContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  promoterDataContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
  },
  textContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  touchableText: {
    textDecorationLine: "underline",
  },
  touchableTextContainer: {
    padding: 4,
    alignItems: "center",
  },
  recordDataContainer: {
    flexDirection: "row",
    marginVertical: 4,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecordItemForStudent;
