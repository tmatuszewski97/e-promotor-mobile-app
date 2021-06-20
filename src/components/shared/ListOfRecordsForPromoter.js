import React from "react";
import RecordItemForPromoter from "./RecordItemForPromoter";

const ListOfRecordsForPromoter = ({
  userStartedAction,
  userEndedAction,
  records,
}) => {
  return records.map((item) => {
    return (
      <RecordItemForPromoter
        key={item.id}
        item={item}
        userStartedAction={userStartedAction}
        userEndedAction={userEndedAction}
      />
    );
  });
};

export default ListOfRecordsForPromoter;
