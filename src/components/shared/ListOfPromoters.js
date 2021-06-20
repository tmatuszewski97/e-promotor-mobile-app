import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../styles";

const ListOfPromoters = ({ onPressItem, promoters }) => {
  return (
    <FlatList
      data={promoters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => onPressItem(item.id)}
        >
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={
                  item.image != null
                    ? { uri: item.image }
                    : require("../../assets/images/blank_profile_picture.png")
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                {item.title +
                  " " +
                  item.user.first_name +
                  " " +
                  item.user.last_name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 50,
  },
  imageContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
  },
  listItemContainer: {
    margin: 4,
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
  },
  text: {
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  textContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListOfPromoters;
