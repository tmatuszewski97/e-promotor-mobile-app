import React from "react";
import { FlatList } from "react-native";
import StudentItem from "./StudentItem";

const ListOfStudents = ({ students, onPressItem }) => {
  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <StudentItem item={item} onPress={onPressItem} />
      )}
    />
  );
};

export default ListOfStudents;
