import MainApi from "../../../MainApi";
import { user_info_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import { getToken } from "helper-functions/getToken";

export const fetchCustomerInfo = async () => {
  const userToken = getToken();
  if (!userToken) return null;
  const { data } = await MainApi.get(user_info_api);
  return data;
};

export default function useGetUserInfo(handleSuccess) {
  return useQuery("user-info", fetchCustomerInfo, {
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 10000,
    cacheTime: 5000,
    onSuccess: handleSuccess,
    onError: onSingleErrorResponse,
  });
}
