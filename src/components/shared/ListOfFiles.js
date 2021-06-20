import React from "react";
import FileItem from "./FileItem";

const ListOfFiles = ({ onPressItem, files }) => {
  return files.map((item) => {
    return (
      <FileItem
        key={item.id}
        item={item}
        onPress={() => onPressItem(item.id)}
      />
    );
  });
};

export default ListOfFiles;
