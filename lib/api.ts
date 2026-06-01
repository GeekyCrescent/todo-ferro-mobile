import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

import { auth } from "./firebase";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("Missing env var: EXPO_PUBLIC_API_URL");
}

export const TOKEN_KEY = "auth.token";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  // Use AxiosHeaders.set() instead of assigning to a plain object: assigning
  // directly breaks bodyless requests (DELETE/PATCH) on React Native with
  // "header name must be a non-empty string".
  config.headers.set("ngrok-skip-browser-warning", "true");

  // Prefer a fresh Firebase token (auto-refreshed by the SDK) so requests
  // don't 401 after the 1-hour expiry; fall back to the last stored token
  // while the session is still being restored on cold start.
  let token: string | null = null;
  const user = auth.currentUser;
  if (user) {
    try {
      token = await user.getIdToken();
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch {
      token = await AsyncStorage.getItem(TOKEN_KEY);
    }
  } else {
    token = await AsyncStorage.getItem(TOKEN_KEY);
  }

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Network error";
    return Promise.reject(new Error(message));
  }
);
