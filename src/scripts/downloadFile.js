import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import getFileNameFromUrl from "./getFileNameFromUrl";

const downloadFile = async (uri) => {
  let fileUri = FileSystem.documentDirectory + getFileNameFromUrl(uri);
  const response = await FileSystem.downloadAsync(uri, fileUri);
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status === "granted") {
    if (Platform.OS === "ios") {
      await Sharing.shareAsync(response.uri);
    } else {
      const asset = await MediaLibrary.createAssetAsync(response.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
    }
  } else {
    await Promise.reject("Permission not granted");
  }
};

export default downloadFile;
