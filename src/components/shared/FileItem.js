import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { getFileNameFromUrl } from "../../scripts";
import { Colors } from "../../styles";
import DownloadFileButton from "./DownloadFileButton";

const FileItem = ({ item, ...props }) => {
  return (
    <TouchableWithoutFeedback {...props}>
      <View style={styles.listItemContainer}>
        <ScrollView horizontal={true} style={{ margin: 4 }}>
          <TouchableOpacity {...props}>
            <Text style={styles.listItemText}>
              {getFileNameFromUrl(item.file)}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <DownloadFileButton file={item.file} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
    color: Colors.PRIMARY,
  },
  textContainer: {
    flex: 1,
    padding: 4,
  },
});

export default FileItem;
