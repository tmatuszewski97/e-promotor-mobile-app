import { useEffect, useState } from "react";

const useSelectionChange = (items) => {
  const [selectionMode, setSelectionMode] = useState(null);

  useEffect(() => {
    if (items.filter((item) => item.selected).length > 0) {
      return setSelectionMode(true);
    } else {
      setSelectionMode(false);
    }
  });

  return selectionMode;
};

export default useSelectionChange;
