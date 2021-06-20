import React from "react";
import { FlatList } from "react-native";
import DeanWorkerItem from "./DeanWorkerItem";

const ListOfDeanWorkers = ({ deanWorkers, onPressItem }) => {
  return (
    <FlatList
      data={deanWorkers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <DeanWorkerItem item={item} onPress={() => onPressItem(item.id)} />
      )}
    />
  );
};

export default ListOfDeanWorkers;
