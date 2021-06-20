import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  token: null,
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN": {
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    }
    case "SIGN_OUT": {
      return {
        ...state,
        ...initialState,
      };
    }
    case "SIGN_IN": {
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    }
  }
};

const signOut = (dispatch) => {
  return async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: "SIGN_OUT" });
  };
};

const signIn = (dispatch) => {
  return async (data) => {
    let userToken = data.token;
    let userData = data.user;
    try {
      await AsyncStorage.setItem("token", userToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      //console.log(error);
    }
    dispatch({
      type: "SIGN_IN",
      token: userToken,
      user: userData,
    });
  };
};

const retrieveToken = (dispatch) => {
  return async () => {
    let userToken = null;
    let userData = null;
    try {
      userToken = await AsyncStorage.getItem("token");
      userData = await AsyncStorage.getItem("user").then((result) =>
        JSON.parse(result)
      );
    } catch (error) {
      console.log(error);
    }
    dispatch({
      type: "RETRIEVE_TOKEN",
      token: userToken,
      user: userData,
    });
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signOut, signIn, retrieveToken },
  initialState
);
