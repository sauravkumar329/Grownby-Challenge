import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const key = "userData";

const isWeb = () => {
  return Platform.OS === "web";
};

const storeUser = async (userData) => {
  try {
    if (isWeb()) {
      localStorage.setItem(key, userData);
    } else {
      await SecureStore.setItemAsync(key, userData);
    }
  } catch (error) {
    console.log("Error storing the auth user", error);
  }
};

const getUser = async () => {
  try {
    if (isWeb()) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.log("Error getting the auth user", error);
  }
};

const removeUser = async () => {
  try {
    if (isWeb()) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
    console.log("user removed");
  } catch (error) {
    console.log("Error removing the auth user", error);
  }
};

export default { getUser, removeUser, storeUser };
