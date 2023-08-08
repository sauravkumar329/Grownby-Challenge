import * as SecureStore from "expo-secure-store";

const key = "userData";

const storeUser = async (userData) => {
  try {
    await SecureStore.setItemAsync(key, userData);
  } catch (error) {
    console.log("Error storing the auth user", error);
  }
};

const getUser = async () => {
  try {
    const data = await SecureStore.getItemAsync (key)
    return data ? data : null;
  } catch (error) {
    console.log("Error getting the auth user", error);
  }
};


const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log("user removed");
  } catch (error) {
    console.log("Error removing the auth user", error);
  }
};

export default { getUser, getUser, removeUser, storeUser };