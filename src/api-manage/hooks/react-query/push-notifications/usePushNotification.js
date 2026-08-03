import { useMutation } from "react-query";
import MainApi from "../../../MainApi";
import { cm_firebase_token_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const postHandler = async (token) => {
  // Guard: never send an empty/null token to the backend
  if (!token || typeof token !== "string" || token.trim() === "") {
    return null;
  }
  const { data } = await MainApi.post(`${cm_firebase_token_api}`, {
    cm_firebase_token: token,
    _method: "put",
  });
  return data;
};
export const useStoreFcm = () => {
  return useMutation("fcm_token", postHandler, {
    // Silently suppress FCM token errors — push notifications are optional.
    // A 403 here just means the VAPID key isn't configured yet.
    onError: () => {},
  });
};
