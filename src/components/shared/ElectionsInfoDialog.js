import React from "react";
import CustomDialog from "./CustomDialog";

const ElectionsInfoDialog = ({ electionsData, ...props }) => {
  return (
    <>
      <CustomDialog
        visible={electionsData.electionsEnded === false}
        dismissable={true}
        dialogType={`Error`}
        text={
          electionsData.requestsSent
            ? `Wszyscy studenci wysłali już swoje prośby w tej turze.\n\nOczekiwanie na decyzje promotorów.`
            : `Niektórzy studenci nie wysłali jeszcze swoich próśb w tej turze.`
        }
        title={`Trwa ${electionsData.tourNumber} tura wyborów`}
        {...props}
      />
      <CustomDialog
        visible={electionsData.electionsEnded === true}
        dismissable={true}
        dialogType={`InformationPositive`}
        text={`Każdy z niezdyskwalifikowanych studentów odnalazł już promotora.\n\nWybory w liczbach:\n- wszyscy studenci: ${electionsData.allStudentsNumber}\n- zdyskwalifikowani studenci: ${electionsData.disqualifiedStudentsNumber}\n- studenci którzy odnaleźli promotora: ${electionsData.chosenStudentsNumber}\n- ilość przeprowadzonych tur: ${electionsData.tourNumber}`}
        title={`Wybory zakończyły się`}
        {...props}
      />
    </>
  );
};

export default ElectionsInfoDialog;
