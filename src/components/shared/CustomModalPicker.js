import React from "react";
import ModalSelector from "react-native-modal-selector";
import { capitalizeText } from "../../scripts";
import { Colors } from "../../styles";

const CustomModalPicker = ({ data, onChange, selectedKey }) => {
  return (
    <ModalSelector
      animationType={"none"}
      data={data}
      initValue={capitalizeText(selectedKey)}
      initValueTextStyle={{
        textAlign: "left",
        color: Colors.PRIMARY,
      }}
      optionContainerStyle={{
        backgroundColor: Colors.WHITE,
        borderWidth: 2,
        borderColor: Colors.PRIMARY,
      }}
      optionStyle={{ backgroundColor: Colors.WHITE }}
      optionTextStyle={{
        color: Colors.PRIMARY,
      }}
      cancelText={`Anuluj`}
      cancelStyle={{ backgroundColor: Colors.PRIMARY }}
      cancelTextStyle={{ color: Colors.WHITE }}
      onChange={onChange}
    />
  );
};

export default CustomModalPicker;
