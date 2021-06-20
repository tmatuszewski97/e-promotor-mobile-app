import React, { useContext } from "react";
import { AuthContext } from "../../contexts";

const ChooseComponentForUser = ({
  administratorComponent,
  deanWorkerComponent,
  promoterComponent,
  studentComponent,
}) => {
  const { state } = useContext(AuthContext);

  return (
    <>
      {state.user.role === 1
        ? administratorComponent
        : state.user.role === 2
        ? deanWorkerComponent
        : state.user.role === 3
        ? promoterComponent
        : state.user.role === 4
        ? studentComponent
        : null}
    </>
  );
};

export default ChooseComponentForUser;
