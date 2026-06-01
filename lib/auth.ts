import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { TOKEN_KEY } from "./api";
import { auth } from "./firebase";

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const token = await user.getIdToken();
  await AsyncStorage.setItem(TOKEN_KEY, token);
  return token;
};

export const logout = async () => {
  await signOut(auth);
  await AsyncStorage.removeItem(TOKEN_KEY);
};
