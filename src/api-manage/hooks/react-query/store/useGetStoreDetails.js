import MainApi from "../../../MainApi";
import { store_details_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

export const getStoreDetailsQueryKey = (store_id) => ["store-details", store_id];

export const fetchStoreDetails = async (store_id) => {
  if (!store_id) return undefined;
  const { data } = await MainApi.get(`${store_details_api}/${store_id}`);
  return data;
};

export const prefetchStoreDetails = (queryClient, store) => {
  if (!queryClient || !store) return;
  const keys = [store?.slug, store?.id].filter(Boolean).map(String);
  keys.forEach((key) => {
    queryClient.prefetchQuery(getStoreDetailsQueryKey(key), () =>
      fetchStoreDetails(key)
    );
  });
};

export const seedStoreDetailsCache = (queryClient, store) => {
  if (!queryClient || !store) return;
  const keys = [store?.slug, store?.id].filter(Boolean).map(String);
  keys.forEach((key) => {
    queryClient.setQueryData(getStoreDetailsQueryKey(key), store);
  });
};

export default function useGetStoreDetails(store_id, options = {}) {
  const { enabled = true, initialData, ...queryOptions } = options;

  return useQuery(
    getStoreDetailsQueryKey(store_id),
    () => fetchStoreDetails(store_id),
    {
      enabled: enabled && !!store_id,
      initialData,
      staleTime: 0,
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      onError: onSingleErrorResponse,
      ...queryOptions,
    }
  );
}
