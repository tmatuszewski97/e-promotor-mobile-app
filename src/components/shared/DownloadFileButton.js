import React, { useState } from "react";
import { Platform } from "react-native";
import { downloadFile } from "../../scripts";
import CustomDialog from "./CustomDialog";
import GradientButton from "./GradientButton";

const DownloadFileButton = ({ file, ...props }) => {
  const [waiting, setWaiting] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(null);

  const handleFileDownload = async (uri) => {
    setWaiting(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await downloadFile(uri);
      setWaiting(false);
      setFileDownloaded(true);
    } catch (error) {
      setWaiting(false);
      setFileDownloaded(false);
    }
  };

  return (
    <>
      <CustomDialog
        visible={waiting}
        dismissable={false}
        dialogType={`Waiting`}
        text={`Trwa pobieranie pliku...`}
        title={`Czekaj...`}
      />
      <CustomDialog
        visible={fileDownloaded}
        dismissable={false}
        dialogType={`InformationPositive`}
        text={
          Platform.OS === "ios"
            ? "Plik może zostać zapisany w pamięci telefonu lub udostępniony w innej aplikacji"
            : "Plik został zapisany w pamięci telefonu"
        }
        title={
          Platform.OS === "ios"
            ? "Udostępnianie pomyślne"
            : "Pobieranie zakończone"
        }
        onPressConfirm={() => setFileDownloaded(null)}
      />
      <CustomDialog
        visible={fileDownloaded === false}
        dismissable={false}
        dialogType={`Error`}
        text={
          Platform.OS === "ios"
            ? "Plik nie mógł zostać udostępniony"
            : "Plik nie mógł zostać zapisany w pamięci telefonu"
        }
        title={"Błąd pobierania"}
        onPressConfirm={() => setFileDownloaded(null)}
      />
      <GradientButton
        {...props}
        onPress={() => handleFileDownload(file)}
        text={`Pobierz`}
        fontSize={12}
      />
    </>
  );
};

export default DownloadFileButton;
