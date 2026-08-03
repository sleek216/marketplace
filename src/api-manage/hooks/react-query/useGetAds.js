import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { paid_ads } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";

/** Same endpoint as mobile; body may be a raw array or wrapped in `data`. */
export const normalizeAdvertisementList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

export const getData = async () => {
  const { data } = await MainApi.get(paid_ads);
  return normalizeAdvertisementList(data);
};
export const useGetAdds = (handleSuccess) => {
  return useQuery(["getAdds",getModuleId()], () => getData(), {
    enabled: true,
    onError: onSingleErrorResponse,
    retry: 1,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
    onSuccess: handleSuccess,
  });
};
